import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, particles, composer, controls;
let time = 0;
let isAnimationEnabled = true;
const particleCount = 15000;
let shockwaves = [];
const MAX_HOME_RADIUS = 45;
let chargeStart = null;
const themes = {
    colors: [new THREE.Color(0xff4800), new THREE.Color(0xff8c00), new THREE.Color(0xd73a00), new THREE.Color(0x3d1005), new THREE.Color(0xffc600)],
    bloom: { strength: 0.35, radius: 0.45, threshold: 0.7 }
};
document.addEventListener('DOMContentLoaded', init);

function createFlagPath(particleIndex, totalParticles) {
    const flagWidth = 200;   // chiều rộng cờ
    const flagHeight = 120;  // chiều cao cờ
    const starRadiusOuter = 35;
    const starRadiusInner = 15;

    const starVertices = [];
    const numStarPoints = 5;

    // Vẽ hình sao vàng ở giữa
    for (let i = 0; i < numStarPoints; i++) {
        let angle = (i / numStarPoints) * Math.PI * 2 - Math.PI / 2;
        starVertices.push(new THREE.Vector2(
            starRadiusOuter * Math.cos(angle),
            starRadiusOuter * Math.sin(angle)
        ));
        angle += Math.PI / numStarPoints;
        starVertices.push(new THREE.Vector2(
            starRadiusInner * Math.cos(angle),
            starRadiusInner * Math.sin(angle)
        ));
    }

    const totalStarSegments = starVertices.length;
    const ratioStar = 0.3; // 30% particle cho ngôi sao
    const starParticles = Math.floor(totalParticles * ratioStar);

    let x, y, z;
    if (particleIndex < starParticles) {
        // Particle cho ngôi sao vàng
        const t_path = (particleIndex / starParticles) * totalStarSegments;
        const segmentIndex = Math.floor(t_path) % totalStarSegments;
        const segmentProgress = t_path - Math.floor(t_path);

        const startVertex = starVertices[segmentIndex];
        const endVertex = starVertices[(segmentIndex + 1) % totalStarSegments];

        x = THREE.MathUtils.lerp(startVertex.x, endVertex.x, segmentProgress);
        y = THREE.MathUtils.lerp(startVertex.y, endVertex.y, segmentProgress);
        z = Math.sin((particleIndex / starParticles) * Math.PI * 4) * 2;

    } else {
        // Particle cho nền cờ đỏ (hình chữ nhật)
        const idx = particleIndex - starParticles;
        const bgParticles = totalParticles - starParticles;

        const row = Math.floor(idx / Math.sqrt(bgParticles));
        const col = idx % Math.floor(Math.sqrt(bgParticles));

        const cols = Math.floor(Math.sqrt(bgParticles));
        const rows = cols;

        x = (col / cols - 0.5) * flagWidth;
        y = (row / rows - 0.5) * flagHeight;
        z = (Math.random() - 0.5) * 1.5; // chút rung động nền
    }

    return new THREE.Vector3(x, y, z);
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.z = 90;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('container').appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.rotateSpeed = 0.3;
    controls.minDistance = 30;
    controls.maxDistance = 300;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.15;
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    scene.userData.bloomPass = bloomPass;
    createParticleSystem();
    window.addEventListener('resize', onWindowResize);

    animate();
}

function triggerShockwave({ amplitude = 12, speed = 28, width = 6, decay = 1.25 } = {}) {
    shockwaves.push({ t0: time, amplitude, speed, width, decay });
    if (shockwaves.length > 6) shockwaves.shift();
}

function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const targetPositions = new Float32Array(particleCount * 3);
    const disintegrationOffsets = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const pos = createFlagPath(i, particleCount);

        // Vị trí
        positions[i3] = pos.x;
        positions[i3 + 1] = pos.y;
        positions[i3 + 2] = pos.z;

        targetPositions[i3] = pos.x;
        targetPositions[i3 + 1] = pos.y;
        targetPositions[i3 + 2] = pos.z;

        // ===== MÀU SẮC =====
        const starRadius = 60;   // chỉnh to nhỏ ngôi sao
        const cx = 0, cy = 0;    // tâm lá cờ
        const dx = pos.x - cx;
        const dy = pos.y - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Hàm xác định có nằm trong ngôi sao không
        const inStar = (() => {
            const n = 5;
            const step = (2 * Math.PI) / n;
            const localAngle = ((angle % step) + step) % step;
            const inner = starRadius * 0.38;
            const outer = starRadius;
            return dist < outer && dist > inner * Math.cos(localAngle * n / 2);
        })();

        if (inStar) {
            // Ngôi sao vàng
            colors[i3] = 1.0;   // R
            colors[i3 + 1] = 1.0; // G
            colors[i3 + 2] = 0.0; // B
        } else {
            // Nền đỏ chuẩn
            colors[i3] = 1.0;   // R
            colors[i3 + 1] = 0.0; // G
            colors[i3 + 2] = 0.0; // B
        }

        // Kích thước hạt
        sizes[i] = 2.2;

        // Hiệu ứng phân rã
        const offsetStrength = 30 + Math.random() * 40;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.acos(2 * Math.random() - 1);
        disintegrationOffsets[i3] = Math.sin(theta) * Math.cos(phi) * offsetStrength;
        disintegrationOffsets[i3 + 1] = Math.sin(theta) * Math.sin(phi) * offsetStrength;
        disintegrationOffsets[i3 + 2] = Math.cos(theta) * offsetStrength * 0.5;
    }


    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('disintegrationOffset', new THREE.BufferAttribute(disintegrationOffsets, 3));
    const texture = createParticleTexture();
    const material = new THREE.PointsMaterial({
        size: 2.8,
        map: texture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        alphaTest: 0.01
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function isInsideStar(x, y) {
    const numPoints = 5;
    const outerRadius = 60; // bán kính ngoài ngôi sao
    const innerRadius = 25; // bán kính trong
    const scale = 1.0;
    const vertices = [];

    for (let i = 0; i < numPoints; i++) {
        let angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        vertices.push(new THREE.Vector2(
            outerRadius * Math.cos(angle),
            outerRadius * Math.sin(angle)
        ));
        angle += Math.PI / numPoints;
        vertices.push(new THREE.Vector2(
            innerRadius * Math.cos(angle),
            innerRadius * Math.sin(angle)
        ));
    }

    // Thuật toán ray-casting để kiểm tra điểm có nằm trong polygon (ngôi sao) không
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function getAttributesForParticle(i) {
    const t = i / particleCount;
    const colorPalette = themes.colors;
    const colorProgress = (t * colorPalette.length * 1.5 + time * 0.05) % colorPalette.length;
    const colorIndex1 = Math.floor(colorProgress);
    const colorIndex2 = (colorIndex1 + 1) % colorPalette.length;
    const blendFactor = colorProgress - colorIndex1;
    const color1 = colorPalette[colorIndex1];
    const color2 = colorPalette[colorIndex2];
    const baseColor = new THREE.Color().lerpColors(color1, color2, blendFactor);
    const color = baseColor.clone().multiplyScalar(0.65 + Math.random() * 0.55);
    const size = 0.65 + Math.random() * 0.6;
    return { color, size };
}

function createParticleTexture() {
    const canvas = document.createElement('canvas');
    const size = 64;
    canvas.width = size; canvas.height = size;
    const context = canvas.getContext('2d');
    const centerX = size / 2, centerY = size / 2;
    const outerRadius = size * 0.45;
    const innerRadius = size * 0.20;
    const numPoints = 5;
    context.beginPath();
    context.moveTo(centerX, centerY - outerRadius);
    for (let i = 0; i < numPoints; i++) {
        const outerAngle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        context.lineTo(centerX + outerRadius * Math.cos(outerAngle), centerY + outerRadius * Math.sin(outerAngle));
        const innerAngle = outerAngle + (Math.PI / numPoints);
        context.lineTo(centerX + innerRadius * Math.cos(innerAngle), centerY + innerRadius * Math.sin(innerAngle));
    }
    context.closePath();
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,220,0.9)');
    gradient.addColorStop(0.6, 'rgba(255,200,150,0.6)');
    gradient.addColorStop(1, 'rgba(255,150,0,0)');
    context.fillStyle = gradient;
    context.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function animateParticles() {
    if (!particles || !isAnimationEnabled) return;
    const positions = particles.geometry.attributes.position.array;
    const targetPositions = particles.geometry.attributes.targetPosition.array;
    const particleColors = particles.geometry.attributes.color.array;
    const particleSizes = particles.geometry.attributes.size.array;
    const disintegrationOffsets = particles.geometry.attributes.disintegrationOffset.array;
    const rotationSpeed = 0.0008;
    const cosRot = Math.cos(rotationSpeed);
    const sinRot = Math.sin(rotationSpeed);
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let tx = targetPositions[i3];
        let ty = targetPositions[i3 + 1];
        targetPositions[i3] = tx * cosRot - ty * sinRot;
        targetPositions[i3 + 1] = tx * sinRot + ty * cosRot;
    }
    const tempRotatedTargets = new Float32Array(targetPositions);
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const nextI = ((i + 1) % particleCount) * 3;
        const flowFactor = Math.sin(time * 0.4 + (i / particleCount) * Math.PI * 10) * 0.005;
        targetPositions[i3] += (tempRotatedTargets[nextI] - tempRotatedTargets[i3]) * flowFactor;
        targetPositions[i3 + 1] += (tempRotatedTargets[nextI + 1] - tempRotatedTargets[i3 + 1]) * flowFactor;
        targetPositions[i3 + 2] += (tempRotatedTargets[nextI + 2] - tempRotatedTargets[i3 + 2]) * flowFactor;
    }
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const iSize = i;
        const homeX = targetPositions[i3];
        const homeY = targetPositions[i3 + 1];
        const homeZ = targetPositions[i3 + 2];
        const disintegrationCycleTime = 10.0;
        const particleCycleOffset = (i / particleCount) * disintegrationCycleTime * 0.5;
        const cycleProgress = ((time * 0.6 + particleCycleOffset) % disintegrationCycleTime) / disintegrationCycleTime;
        let disintegrationAmount = 0;
        const stablePhaseEnd = 0.5;
        const disintegrateStartPhase = stablePhaseEnd;
        const disintegrateFullPhase = stablePhaseEnd + 0.15;
        const holdPhaseEnd = disintegrateFullPhase + 0.1;
        if (cycleProgress < stablePhaseEnd) {
            disintegrationAmount = 0;
        } else if (cycleProgress < disintegrateFullPhase) {
            disintegrationAmount = (cycleProgress - disintegrateStartPhase) / (disintegrateFullPhase - disintegrateStartPhase);
        } else if (cycleProgress < holdPhaseEnd) {
            disintegrationAmount = 1.0;
        } else {
            disintegrationAmount = 1.0 - ((cycleProgress - holdPhaseEnd) / (1.0 - holdPhaseEnd));
        }
        disintegrationAmount = Math.sin(disintegrationAmount * Math.PI * 0.5);
        let addX = 0, addY = 0, addZ = 0;
        const dist = Math.sqrt(homeX * homeX + homeY * homeY + homeZ * homeZ) + 1e-6;
        for (let w = 0; w < shockwaves.length; w++) {
            const sw = shockwaves[w];
            const elapsed = Math.max(0, time - sw.t0);
            const R = sw.speed * elapsed;
            const sigma = sw.width;
            const decayFactor = Math.exp(-sw.decay * elapsed);
            const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sigma * sigma));
            const amp = sw.amplitude * g * decayFactor;
            addX += (homeX / dist) * amp;
            addY += (homeY / dist) * amp;
            addZ += (homeZ / dist) * amp * 0.6;
        }
        let currentTargetX = homeX + addX;
        let currentTargetY = homeY + addY;
        let currentTargetZ = homeZ + addZ;
        let currentLerpFactor = 0.085;
        if (disintegrationAmount > 0.001) {
            currentTargetX += disintegrationOffsets[i3] * disintegrationAmount;
            currentTargetY += disintegrationOffsets[i3 + 1] * disintegrationAmount;
            currentTargetZ += disintegrationOffsets[i3 + 2] * disintegrationAmount;
            currentLerpFactor = 0.045 + disintegrationAmount * 0.02;
        }
        positions[i3] += (currentTargetX - positions[i3]) * currentLerpFactor;
        positions[i3 + 1] += (currentTargetY - positions[i3 + 1]) * currentLerpFactor;
        positions[i3 + 2] += (currentTargetZ - positions[i3 + 2]) * currentLerpFactor;
        const { color: baseParticleColor, size: baseParticleSize } = getAttributesForParticle(i);
        let brightnessFactor = (0.65 + Math.sin((i / particleCount) * Math.PI * 7 + time * 1.3) * 0.35) * (1 - disintegrationAmount * 0.75);
        brightnessFactor *= (0.85 + Math.sin(time * 7 + i * 0.5) * 0.15);
        // particleColors[i3] = baseParticleColor.r * brightnessFactor;
        particleColors[i3 + 1] = baseParticleColor.g * brightnessFactor;
        particleColors[i3 + 2] = baseParticleColor.b * brightnessFactor;
        let currentSize = baseParticleSize * (1 - disintegrationAmount * 0.9);
        currentSize *= (0.8 + Math.sin(time * 5 + i * 0.3) * 0.2);
        particleSizes[iSize] = Math.max(0.05, currentSize);
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.targetPosition.needsUpdate = true;
    particles.geometry.attributes.color.needsUpdate = true;
    particles.geometry.attributes.size.needsUpdate = true;
    if (shockwaves.length) {
        const keep = [];
        for (let w = 0; w < shockwaves.length; w++) {
            const sw = shockwaves[w];
            const elapsed = time - sw.t0;
            const R = sw.speed * elapsed;
            const expiredByRadius = (R - MAX_HOME_RADIUS) > (6 * sw.width);
            const expiredByTime = elapsed > 12;
            if (!(expiredByRadius || expiredByTime)) keep.push(sw);
        }
        shockwaves = keep;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.02;
    controls.update();
    if (isAnimationEnabled) animateParticles();
    composer.render();
}