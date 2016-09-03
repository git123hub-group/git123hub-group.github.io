function m_d_wucleus_step(out, z_guessx, z_guessy, cx, cy, period) {
  var epsilon2 = 1e-24;
  var zzx = z_guessx;
  var zzy = z_guessy;
  var dzzx = 1;
  var dzzy = 0;
  var t;
  var i;
  for (i = 0; i < period; ++i) {
    // dzz = 2 * zz * dzz;
    t = 2 * (zzx * dzzx - zzy * dzzy);
    dzzy = 2 * (zzx * dzzy + zzy * dzzx);
    dzzx = t;
    // zz = zz * zz + c;
    t = zzx * zzx - zzy * zzy + cx;
    zzy = 2 * zzx * zzy + cy;
    zzx = t;
  }
  var dx = zzx - z_guessx;
  var dy = zzy - z_guessy;
  if (dx * dx + dy * dy <= epsilon2) {
    out.zx = z_guessx;
    out.zy = z_guessy;
    return "converged";
  }
  // z_new = z_guess - (zz - z_guess) / (dzz - 1);
  dzzx = dzzx - 1;
  var dzz = dzzx * dzzx + dzzy * dzzy;
  var z_newx = z_guessx - (dx * dzzx + dy * dzzy) / dzz;
  var z_newy = z_guessy - (dy * dzzx - dx * dzzy) / dzz;
  // d = z_new - zz;
  dx = z_newx - zzx;
  dy = z_newy - zzy;
  if (dx * dx + dy * dy <= epsilon2) {
    out.zx = z_newx;
    out.zy = z_newy;
    return "converged";
  }
  if (dx * dx + dy * dy < 1.0/0.0) {
    out.zx = z_newx;
    out.zy = z_newy;
    return "stepped";
  } else {
    out.zx = z_guessx;
    out.zy = z_guessy;
    return "failed";
  }
}

function m_d_wucleus(out, z_guessx, z_guessy, cx, cy, period, maxsteps) {
  var result = "failed";
  var z = { zx: z_guessx, zy: z_guessy };
  var i;
  for (i = 0; i < maxsteps; ++i) {
    if ("stepped" != (result = m_d_wucleus_step(z, z.zx, z.zy, cx, cy, period))) {
      break;
    }
  }
  out.zx = z.zx;
  out.zy = z.zy;
  return result;
}

function m_d_interior_de(out, zx, zy, cx, cy, p, steps) {
  var out2 = { zx: 0, zy: 0 };
  if ("failed" != m_d_wucleus(out2, zx, zy, cx, cy, p, steps)) {
    var z0x = out2.zx;
    var z0y = out2.zy;
    var dz0x = 1;
    var dz0y = 0;
    var t;
    var j;
    for (j = 0; j < p; ++j) {
      // dz0 = 2 * z0 * dz0;
      t = 2 * (z0x * dz0x - z0y * dz0y);
      dz0y = 2 * (z0x * dz0y + z0y * dz0x);
      dz0x = t;
      // z0 = z0 * z0 + c;
      t = z0x * z0x - z0y * z0y + cx;
      z0y = 2 * z0x * z0y + cy;
      z0x = t;
    }
    if (dz0x * dz0x + dz0y * dz0y <= 1) {
      var z1x = out2.zx;
      var z1y = out2.zy;
      var dz1x = 1;
      var dz1y = 0;
      var dzdz1x = 0;
      var dzdz1y = 0;
      var dc1x = 0;
      var dc1y = 0;
      var dcdz1x = 0;
      var dcdz1y = 0;
      for (j = 0; j < p; ++j) {
        // dcdz1 = 2 * (z1 * dcdz1 + dz1 * dc1);
        t = 2 * (z1x * dcdz1x - z1y * dcdz1y + dz1x * dc1x - dz1y * dc1y);
        dcdz1y = 2 * (z1x * dcdz1y + z1y * dcdz1x + dz1x * dc1y + dz1y * dc1x);
        dcdz1x = t;
        // dc1 = 2 * z1 * dc1 + 1;
        t = 2 * (z1x * dc1x - z1y * dc1y) + 1;
        dc1y = 2 * (z1x * dc1y + z1y * dc1x);
        dc1x = t;
        // dzdz1 = 2 * (dz1 * dz1 + z1 * dzdz1);
        t = 2 * (dz1x * dz1x - dz1y * dz1y + z1x * dzdz1x - z1y * dzdz1y);
        dzdz1y = 2 * (2 * dz1x * dz1y + z1x * dzdz1y + z1y * dzdz1x);
        dzdz1x = t;
        // dz1 = 2 * z1 * dz1;
        t = 2 * (z1x * dz1x - z1y * dz1y);
        dz1y = 2 * (z1x * dz1y + z1y * dz1x);
        dz1x = t;
        // z1 = z1 * z1 + c;
        t = z1x * z1x - z1y * z1y + cx;
        z1y = 2 * z1x * z1y + cy;
        z1x = t;
      }
      out.dzx = dz1x;
      out.dzy = dz1y;
      // *de_out = (1 - cabs2(dz1)) / cabs(dcdz1 + dzdz1 * dc1 / (1 - dz1));
      var bx = 1 - dz1x;
      var by = -dz1y;
      var b = bx * bx + by * by;
      var ax = dzdz1x * dc1x - dzdz1y * dc1y;
      var ay = dzdz1x * dc1y + dzdz1y * dc1x;
      t = (ax * bx + ay * by) / b + dcdz1x;
      ay = (ay * bx - ax * by) / b + dcdz1y;
      ax = t;
      out.de = (1 - dz1x * dz1x - dz1y * dz1y) / Math.sqrt(ax * ax + ay * ay);
      return true;
    }
  }
  return false;
}

function m_d_compute_init(px, bias, er, cx, cy) {
  px.tag = "unknown";
  px.bias = bias;
  px.er2 = er * er;
  px.mz2 = 1.0 / 0.0;
  px.cx = cx;
  px.cy = cy;
  px.zx = 0;
  px.zy = 0;
  px.dcx = 0;
  px.dcy = 0;
  px.dzx = 0;
  px.dzy = 0;
  px.n = 0;
  px.p = 0;
  px.np = 0;
  px.partials = [];
  px.de = -1;
}

function m_d_compute_clear(px) {
  px.tag = "unknown";
  px.np = 0;
  px.partials = [];
}

function m_d_compute_step(px, steps) {
  if (px.tag != "unknown") {
    return true;
  }
  var er2 = px.er2;
  var cx = px.cx;
  var cy = px.cy;
  var zx = px.zx;
  var zy = px.zy;
  var dcx = px.dcx;
  var dcy = px.dcy;
  var mz2 = px.mz2;
  var p = px.p;
  var t;
  var z2;
  var i;
  for (i = 1; i <= steps; ++i) {
    // dc = 2 * z * dc + 1;
    t = 2 * (zx * dcx - zy * dcy) + 1;
    dcy = 2 * (zx * dcy + zy * dcx);
    dcx = t;
    // z = z * z + c;
    t = zx * zx - zy * zy + cx;
    zy = 2 * zx * zy + cy;
    zx = t;
    // z2 = cabs2(z);
    z2 = zx * zx + zy * zy;
    if (z2 < mz2) {
      mz2 = z2;
      p = px.n + i;
      if (px.bias == "interior") {
        var out = { dzx: 0, dzy: 0, de: -1 };
        if (m_d_interior_de(out, zx, zy, cx, cy, p, 64)) {
          px.tag = "interior";
          px.p = p;
          px.zx = zx;
          px.zy = zy;
          px.dzx = out.dzx;
          px.dzy = out.dzy;
          px.de = out.de;
          return true;
        }
      } else {
        px.partials[px.np] = { zx: zx, zy: zy, p: p };
        px.np = px.np + 1;
      }
    }
    if (! (z2 < er2)) {
      px.tag = "exterior";
      px.n = px.n + i;
      px.p = p;
      px.zx = zx;
      px.zy = zy;
      px.dcx = dcx;
      px.dcy = dcy;
      px.de = Math.sqrt(z2 / (dcx * dcx + dcy * dcy)) * Math.log(z2);
      return true;
    }
  }
  if (px.bias != "interior") {
    for (i = 0; i < px.np; ++i) {
      zx = px.partials[i].zx;
      zy = px.partials[i].zy;
      p = px.partials[i].p;
      var out = { dzx: 0, dzy: 0, de: -1 };
      if (m_d_interior_de(out, zx, zy, cx, cy, p, 64)) {
        px.tag = "interior";
        px.p = p;
        px.zx = zx;
        px.zy = zy;
        px.dzx = out.dzx;
        px.dzy = out.dzy;
        px.de = out.de;
        return true;
      }
    }
  }
  px.tag = "unknown";
  px.n = px.n + steps;
  px.p = p;
  px.mz2 = mz2;
  px.zx = zx;
  px.zy = zy;
  px.dcx = dcx;
  px.dcy = dcy;
  return false;
}

function m_d_render(ctx, width, height, centerx, centery, r, er, maxiters) {
  var image = ctx.createImageData(width, height);
  var imagedata = image.data;
  var k = 0;
  var j;
  var i;
  var px = { tag: "unknown" };
  for (j = 0; j < height; ++j) {
    for (i = 0; i < width; ++i) {
      var cx = centerx + r * (i - (width/2 - 0.5)) / (height/2);
      var cy = centery - r * (j - (height/2 - 0.5)) / (height/2);
      var dc = r / (height/2);
      m_d_compute_init(px, px.tag, er, cx, cy);
      m_d_compute_step(px, maxiters);
      var g = 0;
      if (px.tag == "exterior" || px.tag == "interior") {
        g = Math.round(255 * Math.tanh(Math.min(Math.max(px.de / dc, 0), 8)));
      }
      imagedata[k++] = g;
      imagedata[k++] = g;
      imagedata[k++] = g;
      imagedata[k++] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}
