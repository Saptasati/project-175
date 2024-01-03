AFRAME.registerComponent("create-models",{
    init: async function () {
        this.getModels();
        this.createModels();

    },
    getModels: function() {
        return fetch("model.json")
        .then(res => res.json())
        .then(data => data);
    },
    createModels: function() {
        var barcodeValue = model.barcode_value;
        var modelUrl = model.model_url;
        var modelName = model.model_name;

        var scene = document.querySelector("a-scene");

        var marker = document.createElement("a-marker");

        marker.setAttribute("id", `marker-${modelName}`);
        marker.setAttribute("type", barcode);
        marker.setAttribute("model_name", modelName);
        marker.setAttribute("value", barcodeValue);
        marker.setAttribute("markerhandler", {})

        scene.appendChild(marker);

        if(barcodeValue === 0) {
            var modelE1 = document.createElement("a-entity");
            modelE1.setAttribute("id", `${modelName}`);
            modelE1.setAttribute("geometry", {
                primitive: "box",
                width: model.width,
                height: model.height
            });
            modelE1.setAttribute("position", model.position);
            modelE1.setAttribute("rotation", model.rotation);
            modelE1.setAttribute("material", {
                color: model.color
            });
            marker.appendChild(modelE1)
        } else {
            var modelE1 = document.createElement("a-entity");
            modelE1.setAttribute("id", `${modelName}`);
            modelE1.setAttribute("gltf-model", `url(${modelUrl})`);
            modelE1.setAttribute("scale", model.scale)
            modelE1.setAttribute("position", model.position);
            modelE1.setAttribute("rotation", model.rotation);
            marker.appendChild(modelE1)
        }

    }

})