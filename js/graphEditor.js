class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.ctx = this.canvas.getContext("2d");

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", (evt) => {
            if (evt.button == 2) { //right-click
                if (this.selected) {
                    this.selected = null;
                } else if (this.hovered) {
                    this.#removePoint(this.hovered);
                }
            }
            if (evt.button == 0) {  //left-click
                if (this.hovered) {
                    this.#select(this.hovered);
                    this.dragging = true;
                    return;
                }
                this.graph.addPoint(this.mouse);
                this.#select(this.mouse);
                this.hovered = this.mouse;
            }
        });
        this.canvas.addEventListener("mousemove", (evt) => {
            this.mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
            if (this.dragging == true) {
                this.selected.x = this.mouse.x;
                this.selected.y = this.mouse.y;
            }
        });
        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());
        this.canvas.addEventListener("mouseup", () => this.dragging = false);
    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point) {
            this.selected = null;
        }
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, {dash: [3, 3] });
            this.selected.draw(ctx, {outline: true});
        }
        if (this.hovered) {
            this.hovered.draw(ctx, {fill: true});
        }
    }
}