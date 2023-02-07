class PortalButtonActor {
    setup() {
        this.listen("openPortal", "openPortal");
    }

    check() {
        let cards = this.queryCards({methodName: "isPortal"}, this);
        this.hasOpened = cards.length > 0;
    }

    isPortal(card) {
        return card.layers.includes("portal");
    }

    openPortal(portalURL) {
        this.check();
        if (this.hasOpened) {return;}
        this.hasOpened = true;

        let translation = this._cardData.openPortalTranslation || [0, 0, 0];
        let rotation = this._cardData.openPortalRotation || [0, 0, 0];
        let width = this._cardData.openPortalWidth || 1;
        let height = this._cardData.openPortalHeight || 1;
        this.createCard({
            translation,
            rotation,
            layers: ["pointer"],
            className: "PortalActor",
            color: 16737996,
            cornerRadius: 0.05,
            depth: 0.05,
            frameColor: 8947848,
            portalURL,
            type: "2d",
            width,
            height,
        });

        this.say("portalChanged");
    }
}

class PortalButtonPawn {
    setup() {
        this.addEventListener("pointerMove", "nop");
        this.addEventListener("pointerEnter", "hilite");
        this.addEventListener("pointerLeave", "unhilite");
        this.addEventListener("pointerTap", "pressedButton");
        this.makeButton();
        this.listen("portalChanged", "setColor");
    }

    setColor() {
        let baseColor = !this.actor.hasOpened
            ? (this.entered ? 0xeeeeee : 0xcccccc)
            : 0x22ff22;

        if (this.shape.children[0] && this.shape.children[0].material) {
            this.shape.children[0].material.color.setHex(baseColor);
        }
    }

    makeButton() {
        [...this.shape.children].forEach((c) => this.shape.remove(c));

        let geometry = new Microverse.THREE.SphereGeometry(0.15, 16, 16);
        let material = new Microverse.THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.8});
        let button = new Microverse.THREE.Mesh(geometry, material);
        this.shape.add(button);
        this.setColor();
    }

    hilite() {
        this.entered = true;
        this.setColor();
    }

    unhilite() {
        this.entered = false;
        this.setColor();
    }

    pressedButton() {
        if (this.actor.hasOpened) {return;}
        let portalURL = this.resolveApp(this.actor._cardData.openPortalURL);
        this.say("openPortal", portalURL);
    }

    resolveApp(app = "microverse") {
        if (app.includes("/")) {return app;}
        let { hostname } = window.location;
        if (hostname.endsWith("croquet.io") || hostname.endsWith("croquet.dev")) {
            return `../${app}/`;
        }
        return `https://croquet.io/${app}/`;
    }
}

export default {
    modules: [
        {
            name: "OpenPortalButton",
            actorBehaviors: [PortalButtonActor],
            pawnBehaviors: [PortalButtonPawn]
        }
    ]
}

/* globals Microverse */
