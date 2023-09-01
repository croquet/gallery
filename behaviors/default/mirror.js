
// mirror.js
// Croquet Microverse
// A variable sized rectangular mirror

// the following import statement is solely for the type checking and
// autocompletion features in IDE.  A Behavior cannot inherit from
// another behavior or a base class but can use the methods and
// properties of the card to which it is installed.
// The prototype classes ActorBehavior and PawnBehavior provide
// the features defined at the card object.

import {ActorBehavior, PawnBehavior} from "../PrototypeBehavior";

class MirrorPawn extends PawnBehavior {
    setup() {
        this.constructMirror();
    }

    constructMirror(){
        const THREE = Microverse.THREE;
        return Promise.all([
            import("../assets/src/Reflector.js"),
        ]).then(([mirror_S]) => {
            let size = this.actor._cardData.mirrorSize;
            const mirrorGeometry = new THREE.PlaneGeometry( ...size );
            this.mirror = new mirror_S.Reflector(
                mirrorGeometry,
                {
                    clipBias: 0.003,
                    color: 0x5588aa,
                    //side:THREE.DoubleSide,
                    //fog: scene.fog !== undefined
                }
            );
            console.log(this.mirror);
            this.mirror.rotation.x=-Math.PI/2; // flip around the x
            this.shape.add(this.mirror);
        });
    }
}

export default {
    modules: [
        {
            name: "Mirror",
            pawnBehaviors: [MirrorPawn],
        }
    ]
}
