import * as THREE from "three";
declare var Detector: any;

export class App {

    private scene: THREE.Scene;
    private controls: THREE.OrbitControls;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private sample: THREE.Object3D;

    constructor() {

        if (!Detector.webgl) Detector.addGetWebGLMessage();

        this.onWindowResize = this.onWindowResize.bind(this);
        this.run = this.run.bind(this);

        this.init();
        this.run();
    }

    private init(): void {

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcccccc);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(-455, 500, 750);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;

        this.controls.minDistance = 100;
        this.controls.maxDistance = 2500;

        this.controls.maxPolarAngle = Math.PI / 2;

        var axesHelper = new THREE.AxesHelper(100);
        axesHelper.position.set(-150, 10, -100);
        this.scene.add(axesHelper);

        // World
        var world = new THREE.Mesh(
            new THREE.BoxGeometry(1000, 1, 1000),
            new THREE.MeshPhongMaterial({ color: 0xFF637b80 })
        );
        this.scene.add(world);

        // Sample object
        this.sample = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100),
            new THREE.MeshStandardMaterial({ color: "blue" })
        );
        this.sample.position.y = 80;
        this.scene.add(this.sample);

        // Lights
        var light1 = new THREE.DirectionalLight(0xffffff);
        light1.position.set(1, 1, 1);
        this.scene.add(light1);

        var light2 = new THREE.DirectionalLight(0x002288);
        light2.position.set(- 1, - 1, - 1);
        this.scene.add(light2);

        var light3 = new THREE.AmbientLight(0x222222);
        this.scene.add(light3);
    }

    private onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private run() {

        this.sample.rotation.x += 0.02;
        this.sample.rotation.y += 0.02;

        this.controls.update();
        this.render();
        requestAnimationFrame(this.run);
    }

    private render() {

        this.renderer.render(this.scene, this.camera);
    }
}

var app = new App();
