ymaps.ready(init);

var newPlacemark;
var testMap;
var currentId;
//var objectManager;

function init() {
  testMap = new ymaps.Map(
    "testMap",
    {
      center: [51.533562, 46.034266],
      zoom: 7,
      controls: [],
    },
    { searchControlProvider: "yandex#search" }
  );

  newPlacemark = new ymaps.Placemark(
    testMap.getCenter(),
    {},
    {
      draggable: true,
    }
  );

  var objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 32,
  });

  objectManager.objects.options.set("preset", "islands#greenDotIcon");

  //testMap.geoObjects.add(newPlacemark);
  testMap.geoObjects.add(objectManager);

  $.ajax({
    url: "json/data.json",
  }).done(function (data) {
    console.log(data);
    objectManager.add(data);
  });
}

function updateDataJSON() {
  newPlacemark.properties.set({
    balloonContentHeader: $('#form input[name="name"]').val(),
    tags: "test_tag",
  });

  let data = JSON.stringify(converPlacemark(newPlacemark));
  console.log(data);

  $.ajax({
    url: "data.php",
    type: "POST",
    data: { newData: data, fileName: "json/data.json" },
    success: loadPlacemarks(),
  });
}

function converPlacemark(placemark) {
  var obj = {
    type: "Feature",
    id: 0, //получать автоматически
    geometry: {
      type: placemark.geometry.getType(),
      coordinates: placemark.geometry.getCoordinates(),
    },
    properties: {
      balloonContentHeader: placemark.properties.get("balloonContentHeader"),
      //body, footer content
      tags: placemark.properties.get("tags"),
    },
  };

  return obj;
}
