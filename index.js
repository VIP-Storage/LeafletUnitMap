const featureCollection = [];

function drawUnit(coordinates, map, building, unit, color = 'Red', rotation = 0) {
    const rectOptions = {color, weight: 1, transform: (rotation > 0)}
    const rectangle = L.rectangle(coordinates, rectOptions);
    const layer = rectangle.addTo(map);

    if (rotation > 0) {
        const bottomRight = coordinates[1];

        layer.transform.enable();
        layer.transform.rotate(rotation, bottomRight);
        layer.transform.disable();
    }

    layer.bindPopup(`Unit - ${building}${unit}`);

    const geoJSON = layer.toGeoJSON();
    geoJSON.properties.building = building;
    geoJSON.properties.unit = unit;
    geoJSON.properties.id = `${building}${unit}`;

    return geoJSON;
}

// Draws units going down the map
function drawStandardUnit(startingLat, startingLon, unitCount, map, building, rows = 2, startingUnitNumber = 100, width = 145, height = 45) {
    let latOffset = startingLat;

    const unitsPerRow = (rows === 2 ? unitCount / rows : unitCount);
    let unitNumber = startingUnitNumber;

    for (let unit = 0; unit < unitsPerRow; unit++) {
        const endLat = latOffset + height;
        const endLon = startingLon + width;

        const geoUnit = drawUnit([[latOffset, startingLon], [endLat, endLon]], map, building, unitNumber);
        featureCollection.push(geoUnit);
        latOffset -= (height + 3);
        unitNumber += 1;
    }

    if (rows === 2) {
        latOffset = startingLat;
        for (let unit = 0; unit < unitsPerRow; unit++) {
            const endLat = latOffset + height;
            const startLon = startingLon + width;
            const endLon = startingLon + (width * 2);

            const geoUnit = drawUnit([[latOffset, startLon], [endLat, endLon]], map, building, unitNumber);
            featureCollection.push(geoUnit);
            latOffset -= (height + 3);
            unitNumber += 1;
        }
    }
}

function drawMediumUnit(startingLat, startingLon, unitCount, map, building, rows = 2, startingUnitNumber = 100) {
    drawStandardUnit(startingLat, startingLon, unitCount, map, building, rows, startingUnitNumber, 85);
}

function drawSmallUnit(startingLat, startingLon, unitCount, map, building, rows = 2, startingUnitNumber = 100) {
    drawStandardUnit(startingLat, startingLon, unitCount, map, building, rows, startingUnitNumber, 50, 34.5);
}

function drawHorizontalUnit(startingLat, startingLon, unitCount, map, building, width = 145, height = 45) {
    let latOffset = startingLat;
    let lonOffset = startingLon;

    let unitNumber = 100;

    for (let unit = 0; unit < unitCount; unit++) {
        const endLat = latOffset + height;
        const endLon = lonOffset + width;

        const geoUnit = drawUnit([[latOffset, lonOffset], [endLat, endLon]], map, building, unitNumber, 'red', 12.38);
        featureCollection.push(geoUnit);
        latOffset += 6.5;
        lonOffset += (width + 3.2);

        unitNumber += 1;
    }
}

function initMap() {
    const map = L.map('map', {
        minZoom: -2,
        maxZoom: 1,
        zoom: -3,
        crs: L.CRS.Simple
    }).setView([0, 0], 0);


    const imageUrl = 'building-outline.svg';
    const bounds = [[-1283, -2000], [2564, 4000]];

    L.imageOverlay(imageUrl, bounds).addTo(map);

    map.setMaxBounds(bounds);
    map.fitBounds(bounds);

    return map;
}

function emitGeoJSON() {
    const featureCollectionObject = {
        type: 'FeatureCollection',
        features: featureCollection
    }

    downloadObjectAsJson(featureCollectionObject, 'storage-unit-layout');
}

function downloadObjectAsJson(exportObj, exportName) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchorNode = document.createElement('a');

    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);

    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function drawHorizontalSmallUnit(baseCoords, amount, building, startingUnitNumber) {
    let topLeft = baseCoords[0];
    let bottomRight = baseCoords[1];
    let unitNumber = startingUnitNumber;

    for (let i = 0; i < amount; i++) {
        const coords = [
            topLeft,
            bottomRight,
        ];

        const layer = L.rectangle(coords, {color: 'red', transform: true}).addTo(map);
        layer.transform.enable();
        layer.transform.rotate(12.38, bottomRight);
        layer.bindPopup(`Unit - ${building}${unitNumber}`);


        topLeft = [
            topLeft[0] + 6.45,
            topLeft[1] + 35.2
        ];

        bottomRight = [
            bottomRight[0] + 6.4,
            bottomRight[1] + 35.2
        ];

        layer.transform.disable();
        unitNumber++;
    }
}

const map = initMap();

// Unit height = 45
// Unit width = 145
drawStandardUnit(1727, -1010, 29, map, "A", 1);
drawStandardUnit(1700, -680, 60, map, "B");
drawStandardUnit(1700, -198, 72, map, "C");
drawStandardUnit(1700, 280, 68, map, "D");
drawStandardUnit(1700, 765, 64, map, "E");
drawStandardUnit(1700, 1240, 60, map, "F");

// Unit height = 45
// Unit width = 85
drawMediumUnit(1695, 1725, 58, map, "G");
drawMediumUnit(1695, 2020, 54, map, "H");
drawMediumUnit(1695, 2320, 52, map, "I");
drawMediumUnit(1695, 2620, 50, map, "J");
drawMediumUnit(1695, 2920, 48, map, "K");
drawMediumUnit(1695, 3220, 46, map, "L");
drawMediumUnit(1695, 3520, 21, map, "M", 1);
drawMediumUnit(1695, 3605, 18, map, "M", 1, 120);

// Unit width = 28
// Unit height = 45
drawSmallUnit(1655, 3824, 12, map, "O", 1);

drawHorizontalUnit(-345, -415, 18, map, 'P', 32, 115)
drawHorizontalUnit(-222, 260, 17, map, 'Q', 32, 115)
drawHorizontalUnit(-105, 895, 17, map, 'R', 32, 115)
drawHorizontalUnit(10, 1532, 17, map, 'S', 32, 115)
drawHorizontalUnit(125, 2170, 17, map, 'T', 32, 115)
drawHorizontalUnit(245, 2805, 9, map, 'U', 32, 115)

document.querySelector('#downloadGeoJSON').addEventListener('click', emitGeoJSON)
