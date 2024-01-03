modelList = [];
AFRAME.registerComponent({
    init: async function() {
        this.el.addEventListener("markerFound", () => {
            var modelName = this.el.getAttribute("model_name");
            var barcodeValue = this.el.getAttribute("value");
            elementsArray.push({ model_name: modelName, barcode_value: barcodeValue });
        });
        this.el.addEventListener("markerLost", () => {
            var modelName = this.el.getAttribute("model_name");
            var index = modelList.findIndex(x => x.model_name === modelName);
            if (index > -1) {
              modelList.splice(index, 1);
            }
          });
    },
    getDistance: function(elA, elB) {
        return elA.object3D.position.distanceTo(elB.object3D.position)
    },
    getModelGeometry: function(models, modelName) {
        var barcodes = Object.keys(models);
        for(var barcode of barcodes) {
            if(models[barcode].model_name === modelName) {
                return{
                    position: models[barcode]["placement_position"],
                    rotation: models[barcode]["placement_rotation"],
                    scale: models[barcode]["placement_scale"],
                    model_url: models[barcode]["placement_url"],
                }
            }
        }

    },
    placeTheModel: function(modelName, models) {
        var isListContainModel = this.isModelPresentInArray(modelList, modelName)
        if(isListContainModel) {
            var distance = null;
            var marker1 = document.querySelector(`#marker-base`);
            var marker2 = document.querySelector(`marker-${modelName}`);

            distance = this.getDistance(marker1, marker2);
            if(distance < 1.25){
                var modelE1 = document.querySelector(`#${modelName}`);
                modelE1.setAttribute("visible", false);

                var isModelPlaced = document.querySelector(`#model-${modelName}`);
                if(isModelPlaced === null) {
                    var el = document.createElement("a-entity");
                    var modelGeometry = this.getModelGeometry(models, modelName);
                    el.setAttribute("id", `model-${modelName}`);
                    el.setAttribute("gltf-model", `url(${modelGeometry.model_url})`);
                    el.setAttribute("position", modelGeometry.position);
                    el.setAttribute("rotation", modelGeometry.rotation);
                    el.setAttribute("scale", modelGeometry.scale);
                    marker1.appendChild(el)
                }
            }
        }

    },
    isModelPresentInArray: function(arr, val) {
        for (var i in arr) {
            if(i.model_name === val) {
                return true;
            } 
        } 
        return false;

    },
    tick: async function()  {
        if(modelList.length > 1) {
            var isBaseModelPresent = this.isModelPresentInArray(modelList, "base");
            var messageText = document.querySelector("#message-text");

            if(!isBaseModelPresent) {
                messageText.setAttribute("visible", true);
            } else {
                if(models === null) {
                    models = await this.getModels();
                }
                messageText.setAttribute("visible", false);
                this.placeTheModel("road", models);
                this.placeTheModel("car", models);
                this.placeTheModel("sun", models);
            }

        }

    }
})