// the following import statement is solely for the type checking and
// autocompletion features in IDE.  A Behavior cannot inherit from
// another behavior or a base class but can use the methods and
// properties of the card to which it is installed.
// The prototype classes ActorBehavior and PawnBehavior provide
// the features defined at the card object.

import {ActorBehavior, PawnBehavior} from "../PrototypeBehavior";

class CircleActor extends ActorBehavior {
    setup() {
        if (!this.circling) {
            this.circling = true;
            this.step();
        }
        this.addEventListener("pointerDown", "toggle");
    }

    step() {
        if (!this.circling) {return;}
        this.future(20).step();
        this.rotateBy(0.01);
        this.forwardBy(0.03);
    }

    toggle() {
        this.circling = !this.circling;
        if (this.circling) {
            this.step();
        }
    }

    teardown() {
        this.removeEventListener("pointerDown", "toggle");
        this.circling = false;
    }
}

export default {
    modules: [
        {
            name: "Circle",
            actorBehaviors: [CircleActor],
        },
    ]
}

/* globals Microverse */
