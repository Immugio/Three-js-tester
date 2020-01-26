import { Vector3, ArrowHelper, Scene, WebGLRenderer, PerspectiveCamera, Object3D, Color, AxesHelper, BoxGeometry, MeshLambertMaterial, MeshStandardMaterial, DirectionalLight, Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

declare var Detector: any;

export class App {

    private scene: Scene;
    private controls: OrbitControls;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;

    private sample: Object3D;

    constructor() {

        document.title = "Cross product";

        if (!Detector.webgl) Detector.addGetWebGLMessage();

        this.onWindowResize = this.onWindowResize.bind(this);
        this.run = this.run.bind(this);
        this.updateArrows = this.updateArrows.bind(this);

        this.init();
        this.run();
    }

    private arrow(dir: Vector3, color?: any, origin?: Vector3) {

        origin = origin = new Vector3(0, 300, 0);
        var arrowHelper = new ArrowHelper(dir, origin, 300, color, 20, 10);
        this.scene.add(arrowHelper);
        return arrowHelper;
    }

    private v1: Vector3;
    private v2: Vector3;
    private cross: Vector3;

    private a1: ArrowHelper;
    private a2: ArrowHelper;
    private c: ArrowHelper;

    private updateArrows() {

        var v1 = this.v1.clone().normalize();
        var v2 = this.v2.clone().normalize();

        console.log(v1);

        this.cross.crossVectors(v1, v2).normalize();
        var cross = this.cross.clone().normalize();

        if (this.a1) {
            this.scene.remove(this.a1, this.a2, this.c);
        }

        this.a1 = this.arrow(v1, "red");
        this.a2 = this.arrow(v2, "blue");
        this.c = this.arrow(cross, "green");
    }

    private init(): void {

        window.addEventListener("resize", () => this.onWindowResize());

        this.scene = new Scene();

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new Color(0xFFFFFF));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        document.body.appendChild(this.renderer.domElement);

        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(-455, 1000, 750);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;

        this.controls.minDistance = 100;
        this.controls.maxDistance = 2500;

        this.controls.maxPolarAngle = Math.PI / 2;

        var axesHelper = new AxesHelper(100);
        axesHelper.position.set(-300, 10, -300);
        this.scene.add(axesHelper);

        this.v1 = new Vector3(1, 0, 0);
        this.v2 = new Vector3(0, 0, -1);
        this.cross = new Vector3();
        this.updateArrows();

        var gui = new dat.GUI();
        var vec1 = gui.addFolder("A - Red Vector");
        vec1.open();

        var v1x = vec1.add(this.v1, "x", -1, 1, .01);
        v1x.onChange(this.updateArrows);

        var v1y = vec1.add(this.v1, "y", -1, 1, .01);
        v1y.onChange(this.updateArrows);

        var v1z = vec1.add(this.v1, "z", -1, 1, .01);
        v1z.onChange(this.updateArrows);

        var vec2 = gui.addFolder("B - Blue Vector");
        vec2.open();

        var v2x = vec2.add(this.v2, "x", -1, 1, .01);
        v2x.onChange(this.updateArrows);

        var v2y = vec2.add(this.v2, "y", -1, 1, .01);
        v2y.onChange(this.updateArrows);

        var v2z = vec2.add(this.v2, "z", -1, 1, .01);
        v2z.onChange(this.updateArrows);



        // World
        var world = new Mesh(
            new BoxGeometry(1000, 1, 1000),
            new MeshLambertMaterial({ color: 0xFF637b80 })
        );
        world.receiveShadow = true;
        this.scene.add(world);

        const material = new MeshStandardMaterial({ color: "red" });



        this.sample = new Mesh(
            new BoxGeometry(50, 50, 50),
            material
        );
        this.sample.castShadow = true;
        this.sample.position.y = 80;
        this.sample.position.set(30, 80, 30);

        //this.scene.add(this.sample);

        var light1 = new DirectionalLight(0xFFFFFF);
        light1.position.set(-40, 40, -15);
        light1.position.copy(this.camera.position);
        light1.position.x = -light1.position.x;
        light1.castShadow = true;
        this.scene.add(light1);

        // var light3 = new AmbientLight(0x222222);
        // this.scene.add(light3);

        this.controls.target.copy(this.sample.position);
    }

    private onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private run() {

        // this.sample.rotation.x += 0.02;
        // this.sample.rotation.y += 0.02;

        this.controls.update();
        this.render();
        requestAnimationFrame(this.run);
    }

    private render() {

        this.renderer.render(this.scene, this.camera);
    }
}

var app = new App();
