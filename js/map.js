ymaps.ready(init);

var myMap, objectManager, addPlacemarkButton, newPlacemark, sidePanel;
var currentId;

var region;
var clusterer;
var multiRoute;

var addPlacemarkForm,
  infoPanel,
  isPlace = true,
  balloonLayout;

$.ajax({
  url: "add_placemark_form.html",
  dataType: "html",
}).done(function (data) {
  addPlacemarkForm = data;
});

$.ajax({
  url: "info_panel.html",
  dataType: "html",
}).done(function (data) {
  infoPanel = data;
});

$("body").on("click", ".close-form", function () {
  removeAddPlacemarkForm();
  removeLastPlacemark();
});

$("body").on("click", ".close-panel", function () {
  removeInfoPanel();
});

function init() {
  //Создание карты
  myMap = new ymaps.Map(
    "map",
    {
      center: [51.533562, 46.034266],
      zoom: 12,
      controls: ["zoomControl", "geolocationControl"],
    },
    {
      //Ограничение области видимости карты
      restrictMapArea: [
        [-85, -179],
        [85, 179],
      ],
    }
  );
  //Создание менеджера объектов
  objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: "default#pieChart",
  });
  //Создание кастомного элемента управления типом карты (Слои)
  var typeSelector = new ymaps.control.TypeSelector({
    mapTypes: ["yandex#map", "yandex#satellite", "yandex#hybrid"],
    options: {
      panoramasItemMode: "off",
    },
  });

  //Создание кнопки добавления меток
  addPlacemarkButton = new ymaps.control.Button({
    data: { content: "Добавить метку" },
    options: { selectOnClick: false, maxWidth: 125 },
  });

  myMap.geoObjects.add(objectManager);
  //myMap.geoObjects.add(collection);

  myMap.controls.add(addPlacemarkButton, { float: "right", floatIndex: 1000 });
  myMap.controls.add(typeSelector, { float: "right" });

  //==================================
  //Обработчик кнопки добавления меток
  //==================================

  addPlacemarkButton.events.add("click", function (e) {
    if (!e.get("target").isSelected()) {
      newPlacemark = new ymaps.Placemark(
        myMap.getCenter(),
        {
          hintContent: "Перемести меня",
        },
        {
          draggable: true,
          //Иконка метки
        }
      );
      myMap.geoObjects.add(newPlacemark);
      addPlacemarkButton.select();

      $("#main-map-content").append(addPlacemarkForm);
    } else {
      removeLastPlacemark();
      removeAddPlacemarkForm();
    }
  });

  //==================================
  //**********************************
  //==================================

  //==================================
  //Шаблон информационной панели метки
  //==================================

  /*balloonLayout = ymaps.templateLayoutFactory.createClass(
    '<div class="map-obj">' +
      '<div class="map-obj-photo">' +
      '<img src="imgs/conservatoria.jpg" id="img_">' +
      '<span class="close" onclick="closePop()"><i class="fas fa-times"></i></span>' +
      "</div>" +
      '<div class="map-obj-content">' +
      '<h3 class="title">$[properties.balloonContentHeader]</h3>' +
      '<div class="map-obj-info">' +
      '<div class="geo"><i class="fas fa-map-marker"></i> <span>$[properties.address]</span></div>' +
      '<div class="hashtag"><span><a>$[properties.tags]<a></span></div>' +
      '<div class="description"><span>$[properties.description]</span></div>' +
      '<div class="averageCheck"><span><b>Средний чек: </b>$[properties.sum]</span></div>' +
      '<div class="averageCheck"><span><b>Время работы: </b>$[properties.open_time]-$[properties.close_time]</span></div>' +
      '<div class="linkToSite"><span><a href="$[properties.link]">Ссылка на сайт</a></span></div>' +
      "</div>" +
      '<button type="button" name="button" class="btn btn-danger" style="margin-left: 110px;">Добавить к маршруту</button>' +
      "</div>" +
      "</div>",
    {
      build: function () {
        this.constructor.superclass.build.call(this);
        $[".close"].bind("click", onClose);
      },
      clear: function () {
        this.constructor.superclass.clear.call(this);
      },
      onClose: function () {
        $[".map-obj"].remove();
      },
    }
  );*/

  objectManager.objects.events.add("click", function (e) {
    var id = e.get("objectId"),
      geoObject = objectManager.objects.getById(id);

    $("#main-map-content").append(infoPanel);

    $(".title-panel").append(geoObject.properties.balloonContentHeader);
    $(".address-panel").append(geoObject.properties.address);
    $(".hashtag-panel").append(
      "<span><a>" + geoObject.properties.tags + "<a></span>"
    );
    $(".description-panel").append(
      "<span><a>" + geoObject.properties.balloonContentBody + "<a></span>"
    );
    $(".open-time-panel").append(
      "<span><b>Время работы: </b>" +
        geoObject.properties.open_time +
        "-" +
        geoObject.properties.close_time +
        "</span>"
    );
    $(".linkToSite-panel").append(
      '<span><a href="' +
        geoObject.properties.link +
        '">Ссылка на сайт</a></span>'
    );

    if (geoObject.properties.sum) {
      $(".average-panel").append(
        "<span><b>Средний чек: </b>" + geoObject.properties.sum + "</span>"
      );
    }
  });

  /*sidePanel = new ymaps.Panel();
  myMap.controls.add(sidePanel, { float: "left" });

  var collection = new ymaps.GeoObjectCollection(null, {
    hasBallon: false,
  });*/

  //==================================
  //**********************************
  //==================================

  //myMap.container.fitToVeiwport();
  //myMap.copyrights.add("Vasya Pupkin");

  //Выделение региона
  //makeBorder();

  //myMap.geoObjects.add(clusterer);

  loadPlacemarks();
}

function showPlaceForm() {
  $("#food_menu").css("display", "none");
  $("#place_menu").css("display", "block");
  $("#place_interests").addClass("active");
  $("#place_cafe").removeClass("active");

  isPlace = true;
}

function showCafeForm() {
  $("#place_menu").css("display", "none");
  $("#food_menu").css("display", "block");
  $("#place_cafe").addClass("active");
  $("#place_interests").removeClass("active");

  isPlace = false;
}

function loadPlacemarks() {
  $.ajax({
    url: "json/data.json",
  }).done(function (data) {
    currentId = data.features.length;
    objectManager.add(data);
    /*objectManager.objects.each(function (object) {
      collection.add(object);
    });*/
  });
}

function removeLastPlacemark() {
  myMap.geoObjects.remove(
    myMap.geoObjects.get(myMap.geoObjects.getLength() - 1)
  );

  addPlacemarkButton.deselect();
}

function removeAddPlacemarkForm() {
  $(".map-obj_creat").remove();
}

function removeInfoPanel() {
  $(".map-obj").remove();
}

//========================
//Функции добавления меток
//========================

function updateDataJSON() {
  //Тут шо то не так
  ymaps
    .geocode(newPlacemark.geometry.getCoordinates(), {
      json: true,
      results: 1,
    })
    .then(function (result) {
      var members = result.GeoObjectCollection.featureMember,
        geoObjectData = members && members.length ? members[0].GeoObject : null;
      if (geoObjectData) {
        newPlacemark.properties.set({
          address: geoObjectData.metaDataProperty.GeocoderMetaData.text,
        });
      }
    });

  /*if (isPlace) {
    newPlacemark.properties.set({
      balloonContentHeader:
        '<div class="map-obj"><div class="map-obj-photo"><img src="imgs/conservatoria.jpg" id="img_"><span class="close" onclick="closePop()"><i class="fas fa-times"></i></span></div><div class="map-obj-content"><h3 class="title">' +
        $('#form input[name="name"]').val() +
        "</h3>",
      balloonContentBody:
        '<div class="map-obj-info"><div class="geo"><i class="fas fa-map-marker"></i> <span>' +
        $('#form input[name="address"]').val() +
        '</span></div><div class="hashtag"><span><a>' +
        $('#form select[name="place[]"]').val() +
        '<div class="description"><span>' +
        $('#form textarea[name = "description"]').val() +
        '</span></div><div class="averageCheck"><span><b>Время на посещение: </b>' +
        $('#form input[name="averageTime"]').val() +
        '</span></div><div class="averageCheck"><span><b>Время работы: </b>' +
        $('#form input[name="open-time"]').val() +
        "-" +
        $('#form input[name="close-time"]').val() +
        '<div class="linkToSite"><span><a href="' +
        $('#form input[name="link"]').val() +
        '">Ссылка на сайт</a></span></div></div><button type="button" name="button" class="btn btn-danger" style="margin-left: 110px;">Добавить к маршруту</button></div></div>',
      hintContent: $('#form input[name="name"]').val(),
    });
  } else {
    newPlacemark.properties.set({
      balloonContentHeader:
        '<div class="map-obj"><div class="map-obj-photo"><img src="imgs/conservatoria.jpg" id="img_"><span class="close" onclick="closePop()"><i class="fas fa-times"></i></span></div><div class="map-obj-content"><h3 class="title">' +
        $('#form input[name="name"]').val() +
        "</h3>",
      balloonContentBody:
        '<div class="map-obj-info"><div class="geo"><i class="fas fa-map-marker"></i> <span>' +
        $('#form input[name="address"]').val() +
        '</span></div><div class="hashtag"><span><a>' +
        $('#form select[name="food[]"]').val() +
        '<div class="description"><span>' +
        $('#form textarea[name = "description"]').val() +
        '<div class="averageCheck"><span><b>Средний чек: </b>' +
        $('#form input[name="sum"]').val() +
        '</span></div><div class="averageCheck"><span><b>Время работы: </b>' +
        $('#form input[name="open-time"]').val() +
        "-" +
        $('#form input[name="close-time"]').val(),
      balloonContentFooter:
        '<div class="linkToSite"><span><a href="' +
        $('#form input[name="link"]').val() +
        '">Ссылка на сайт</a></span></div></div><button type="button" name="button" class="btn btn-danger" style="margin-left: 110px;">Добавить к маршруту</button></div></div>',
    });
  }*/

  newPlacemark.options.set({ hasBalloon: false });

  newPlacemark.properties.set({
    balloonContentHeader: $('#form input[name="name"]').val(),
    balloonContentBody: $('#form textarea[name = "description"]').val(),
    address: $('#form input[name = "address"]').val(),
    open_time: $('#form input[name="open-time"]').val(),
    close_time: $('#form input[name="close-time"]').val(),
    link: $('#form input[name="link"]').val(),
  });

  if (isPlace) {
    newPlacemark.properties.set({
      averageTime: $('#form input[name="averageTime"]').val(),
      tags: $('#form select[name="place[]"]').val(),
    });
  } else {
    newPlacemark.properties.set({
      sum: $('#form input[name="sum"]').val(),
      tags: $('#form select[name="food[]"]').val(),
    });
  }

  let data = JSON.stringify(converPlacemark(newPlacemark));

  $.ajax({
    url: "data.php",
    type: "POST",
    data: { newData: data, fileName: "json/data.json" },
    success: loadPlacemarks(),
  });

  return false;
}

function converPlacemark(placemark) {
  var obj = {
    type: "Feature",
    id: currentId,
    geometry: {
      type: placemark.geometry.getType(),
      coordinates: placemark.geometry.getCoordinates(),
    },
    properties: {
      balloonContentHeader: placemark.properties.get("balloonContentHeader"),
      balloonContentBody: placemark.properties.get("balloonContentBody"),
      address: placemark.properties.get("address"),
      open_time: placemark.properties.get("open_time"),
      close_time: placemark.properties.get("close_time"),
      averageTime: placemark.properties.get("averageTime"),
      sum: placemark.properties.get("sum"),
      link: placemark.properties.get("link"),
      tags: placemark.properties.get("tags"),
    },
    options: {
      hasBalloon: placemark.options.get("hasBalloon"),
    },
  };

  return obj;
}

//========================
//************************
//========================

function makeBorder() {
  region = ymaps
    .geoQuery(
      ymaps.borders.load("RU", {
        lang: "ru",
      })
    )
    .search('properties.hintContent = "Саратовская область"')
    .setOptions({
      fillOpacity: "0.4",
      fillColor: "#B2E3FC",
      strokeColor: "#0084CE",
    });

  region.addToMap(myMap);
}

function showPath() {
  multiRoute = new ymaps.multiRouter.MultiRoute(
    {
      // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
      referencePoints: [
        [places[2].latitude, places[2].longitude],
        [places[4].latitude, places[4].longitude],
        [places[1].latitude, places[1].longitude],
        [places[3].latitude, places[3].longitude],
      ],
    },
    {
      // Внешний вид путевых точек.
      wayPointStartIconColor: "#FFFFFF",
      wayPointStartIconFillColor: "#CE0040",
      // Внешний вид линии активного маршрута.
      routeActiveStrokeWidth: 5,
      routeActiveStrokeStyle: "solid",
      routeActiveStrokeColor: "0084CE",
      // Внешний вид линий альтернативных маршрутов.
      routeStrokeStyle: "dot",
      routeStrokeWidth: 3,
      boundsAutoApply: true,
    }
  );

  // Добавление маршрута на карту.
  myMap.geoObjects.add(multiRoute);

  $("div.editRout").show();
}

function changeRout(newrout, elem) {
  $(".rout span").removeClass("selected");
  $(elem).addClass("selected");
  multiRoute.model.setParams({
    routingMode: newrout,
  });
}

function closeRout() {
  $("div.editRout").hide();
  myMap.geoObjects.remove(multiRoute);
}
