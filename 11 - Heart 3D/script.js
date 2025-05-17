import * as THREE from "three";

import { OrbitControls as e } from "three/addons/controls/OrbitControls.js";

import { MeshSurfaceSampler as t } from "three/addons/math/MeshSurfaceSampler.js";

import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

import {
    SUBTRACTION as n,
    ADDITION as a,
    Brush as i,
    Evaluator as r
} from "three-bvh-csg";

!(function () {
    "use strict";
    function o() {
        ((c = new THREE.Scene()).environment = R),
            (d = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: !0,
                alpha: !0
            })).setPixelRatio(window.devicePixelRatio),
            d.setSize(window.innerWidth, window.innerHeight),
            (d.useLegacyLights = !1),
            (E = new THREE.PerspectiveCamera(
                35,
                window.innerWidth / window.innerHeight,
                0.1,
                3 * M
            )).position.set(0, 0, M * Math.sqrt(2)),
            E.lookAt(0, 0, 0);
        const o = new THREE.AmbientLight(16777215, 0.3);
        c.add(o);
        const H = new THREE.DirectionalLight(16777215, 1);
        H.position.set(0, 2 * M, 0),
            c.add(H),
            (c.fog = new THREE.FogExp2(16101802, 0.005)),
            ((w = new e(E, d.domElement)).autoRotate = !0),
            (w.autoRotateSpeed = 2),
            (w.enableDamping = !0),
            (w.enablePan = !1),
            (w.minDistance = 2),
            (w.maxDistance = 2 * M),
            w.target.set(0, 0, 0),
            w.update(),
            (p = new THREE.MeshStandardMaterial({
                metalness: 1,
                roughness: 0
            })),
            (g = []),
            (m = new THREE.CapsuleGeometry(3, 6, 5, 20)).rotateZ(-Math.PI / 3.78),
            m.translate(0, -1, 0),
            m.scale(1, 1, 0.85),
            m.scale(0.23, 0.23, 0.23),
            (m = (function (e) {
                let t,
                    o,
                    s,
                    l,
                    E = e.clone(),
                    c = new THREE.MeshBasicMaterial({}),
                    d = 2 * m.parameters.radius,
                    w = 2 * m.parameters.height,
                    p = new THREE.BoxGeometry(d, w, d);
                return (
                    p.translate(-d / 2, 0, 0),
                    (t = new r()),
                    (o = new i(E, c)),
                    (s = new i(p, c)),
                    (t.useGroups = !0),
                    (l = t.evaluate(o, s, n, l)),
                    (e = l.geometry.clone()).rotateY(Math.PI),
                    (t = new r()),
                    (o = new i(l.geometry, c)),
                    (s = new i(e, c)),
                    (t.useGroups = !0),
                    (l = t.evaluate(o, s, a, l)).geometry
                );
            })(m)),
            (m = BufferGeometryUtils.mergeVertices(m)).computeVertexNormals(),
            (m = m.clone()).scale(18, 18, 18),
            (p = p.clone()),
            (h = new THREE.Mesh(m, p)),
            (m = m.clone()).scale(0.03, 0.03, 0.03);
        const y = new THREE.Color(),
            b = new t(h).build();
        u = new THREE.InstancedMesh(m, p, T);
        new THREE.Matrix4();
        for (let e = 0; e < T; e++)
            b.sample(x, S),
                f.position.copy(x),
                f.lookAt(S),
                f.updateMatrix(),
                u.setMatrixAt(e, f.matrix),
                u.setColorAt(
                    e,
                    y.setHSL(
                        Math.abs(THREE.MathUtils.randInt(8500, 1e4) / 1e4) + 0.02,
                        1,
                        THREE.MathUtils.randInt(500, 800) / 1e3 - 0.1
                    )
                );
        u.instanceMatrix.setUsage(THREE.DynamicDrawUsage),
            c.add(u),
            window.addEventListener("resize", s),
            l();
    }
    function s() {
        (E.aspect = window.innerWidth / window.innerHeight),
            E.updateProjectionMatrix(),
            d.setSize(window.innerWidth, window.innerHeight);
    }
    function l() {
        requestAnimationFrame(l),
            w.update(),
            (function () {
                let e = Math.sin(v / G + 1) * A + 1 + A,
                    t = Math.cos((v / G) * 1.7 + 1) * A + 1 + A,
                    n = Math.sin((v / G) * 2.3 + 1) * A + 1 + A;
                for (let a = 0; a < T; a++)
                    u.getMatrixAt(a, f.matrix),
                        f.matrix.decompose(f.position, f.quaternion, f.scale),
                        (b =
                            a % 4 == 0
                                ? 1
                                : a % 4 == 1
                                    ? (1 / f.scale.x) * e
                                    : a % 4 == 2
                                        ? (1 / f.scale.x) * t
                                        : (1 / f.scale.x) * n),
                        y.set(b, b, b),
                        f.matrix.scale(y),
                        u.setMatrixAt(a, f.matrix);
                (u.instanceMatrix.needsUpdate = !0), v++, d.render(c, E);
            })();
    }
    let E,
        c,
        d,
        w,
        m,
        p,
        u,
        h,
        R,
        H,
        g = [];
    const T = 1500,
        M = 60,
        f = new THREE.Object3D(),
        x = new THREE.Vector3(),
        y = (new THREE.Euler(), new THREE.Quaternion(), new THREE.Vector3()),
        S = new THREE.Vector3();
    (H = new THREE.TextureLoader()).setCrossOrigin(""),
        H.load(
            "https://happy358.github.io/Images/HDR/kloofendal_48d_partly_cloudy_puresky_2k.jpg",
            function (e) {
                (e.colorSpace = THREE.SRGBColorSpace),
                    (e.minFilter = THREE.NearestFilter),
                    (e.generateMipmaps = !1),
                    (e.mapping = THREE.EquirectangularReflectionMapping),
                    (R = e),
                    o();
            }
        );
    let b,
        v = 0,
        G = 20,
        A = 0.3;
})();
