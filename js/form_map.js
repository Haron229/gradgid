ymaps.ready(init);

var newPlacemark;
var testMap;

function init() {
  testMap = new ymaps.Map("testMap", {
    center: [51.533562, 46.034266],
    zoom: 7,
    controls: [],
  });

  newPlacemark = new ymaps.Placemark(
    testMap.getCenter(),
    {
      //hintContent: "Подсказка метки",
    },
    {
      draggable: true,
    }
  );

  var objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 32,
  });

  /*newPlacemark.events.add("click", function (e) {
    if ($("#form").css("display") == "block") {
      $("#form").remove();
    } else {
      var formContent =
        '<div id=\'form\'>\
				<input type="text" name="icon_text"/>\
				<input type="submit" value="Сохранить"/>\
			</div>';

      $("body").append(formContent);
      $("#form").css({
        left: e.get("pagePixels")[0],
        top: e.get("pagePixels")[1],
      });

      $('#form input[name="icon_text"]').val(
        newPlacemark.properties.get("iconContent")
      );

      $('#form input[type="submit"]').click(function () {
        newPlacemark.properties.set({
          iconContent: $('#form input[name="icon_text"]').val(),
        });

        $("#form").remove();
      });
    }
  });*/

  testMap.geoObjects.add(newPlacemark);
  testMap.geoObjects.add(objectManager);

  $.ajax({
    url: "json/data.json",
  }).done(function (data) {
    objectManager.add(data);
  });
}

function updateDataJSON() {
  newPlacemark.properties.set({
    balloonContentHeader: $('#form input[name="name"]').val(),
  });

  let data = JSON.stringify(converPlacemark(newPlacemark));
  console.log(data);

  $.ajax({
    url: "data.php",
    type: "POST",
    data: { newData: data, fileName: "/json/data.json" },
  });
}

function converPlacemark(placemark) {
  var obj = {
    type: "Feature",
    id: 123,
    geometry: {
      type: newPlacemark.geometry.getType(),
      coordinates: newPlacemark.geometry.getCoordinates(),
    },
    properties: {
      balloonContentHeader: newPlacemark.properties.get("balloonContentHeader"),
      //body, footer content
    },
  };

  return obj;
}
