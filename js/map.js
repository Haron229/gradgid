ymaps.ready(init);

var myMap,
  objectManager,
  objectBuffer,
  placesCollection,
  foodCollection,
  addPlacemarkButton,
  newPlacemark;

var currentId;

var region;
var clusterer;

var multiRoute,
  routePointsCoordinates = [],
  routePointsFull = [],
  openPoint = null;

var addPlacemarkForm,
  infoPanel,
  routePanel,
  isPlace = true,
  resetBuffer = false;

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

$.ajax({
  url: "route_panel.html",
  dataType: "html",
}).done(function (data) {
  routePanel = data;
});

$("body").on("click", ".close-form", function () {
  removeAddPlacemarkForm();
  removeLastPlacemark();
});

$("body").on("click", ".close-panel", function () {
  removeInfoPanel();
  removeRoutePanel();
});

$("body").on("click", ".close-autoriz", function () {
  $(".form_autor_backgr").css("display", "none");
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
    preset: "islands#redClusterIcons",
  });

  objectBuffer = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    preset: "islands#redClusterIcons",
  });

  //===========
  //Фильтрация
  //===========

  var listBoxItems = [
      "Памятники",
      "Парки",
      "Театры",
      "Магазины",
      "Учебные заведения",
      "Кафе",
      "Рестораны",
      "Столовые",
      "Кофейни",
      "Кондитерские ",
    ].map(function (title) {
      return new ymaps.control.ListBoxItem({
        data: {
          content: title,
        },
        state: {
          selected: true,
        },
      });
    }),
    reducer = function (filters, filter) {
      filters[filter.data.get("content")] = filter.isSelected();
      return filters;
    },
    // Теперь создадим список, содержащий 5 пунктов.
    listBoxControl = new ymaps.control.ListBox({
      data: {
        content: "Фильтр",
        title: "Фильтр",
      },
      items: listBoxItems,
      state: {
        // Признак, развернут ли список.
        expanded: false,
        filters: listBoxItems.reduce(reducer, {}),
      },
    });
  myMap.controls.add(listBoxControl, { float: "left", floatIndex: 1000 });

  // Добавим отслеживание изменения признака, выбран ли пункт списка.
  listBoxControl.events.add(["select", "deselect"], function (e) {
    var listBoxItem = e.get("target");
    var filters = ymaps.util.extend({}, listBoxControl.state.get("filters"));
    filters[listBoxItem.data.get("content")] = listBoxItem.isSelected();
    listBoxControl.state.set("filters", filters);
  });

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add("filters", function (filters) {
    // Применим фильтр.
    objectManager.setFilter(getFilterFunction(filters));
  });

  function getFilterFunction(categories) {
    return function (obj) {
      var content = obj.properties.tags;
      return categories[content];
    };
  }

  //============================================
  //********************************************
  //============================================

  //Создание отдельных коллекций для мест
  placesCollection = new ymaps.GeoObjectCollection(null, {
    iconLayout: "default#image",
    iconImageHref: "imgs/marker_red.png",
  });

  foodCollection = new ymaps.GeoObjectCollection(null, {
    preset: "islands#redFoodCircleIcon",
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

  //Создание кнопки маршрута
  routeButton = new ymaps.control.Button({
    data: { content: "Маршрут" },
    options: { selectOnClick: false, maxWidth: 125 },
  });

  myMap.geoObjects.add(objectManager);
  //myMap.geoObjects.add(placesCollection);
  //myMap.geoObjects.add(foodCollection);

  myMap.controls.add(routeButton, { float: "right", floatIndex: 1000 });
  myMap.controls.add(addPlacemarkButton, { float: "right", floatIndex: 500 });
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
          iconLayout: "default#image",
          iconImageHref: "imgs/marker_blue.png",
          iconImageSize: [30, 45],
          iconImageOffset: [-15, 0],
        }
      );
      myMap.geoObjects.add(newPlacemark);
      addPlacemarkButton.select();

      $("#main-map-content").append(addPlacemarkForm);
      removeRoutePanel();
    } else {
      removeLastPlacemark();
      removeAddPlacemarkForm();
    }
  });

  //==================================
  //**********************************
  //==================================

  //==================================
  //Обработчик кнопки маршрута========
  //==================================

  routeButton.events.add("click", function (e) {
    if (routePointsFull.length == 0) {
      alert("Маршрут еще не задан. Добавьте хотя бы две точки.");
      return;
    }

    if (!e.get("target").isSelected()) {
      routeButton.select();

      if (addPlacemarkButton.isSelected()) addPlacemarkButton.deselect();

      $("#main-map-content").append(routePanel);

      showRoutePoints();

      removeAddPlacemarkForm();
    } else {
      removeRoutePanel();
    }
  });

  //==================================
  //**********************************
  //==================================

  //==================================
  //Шаблон информационной панели метки
  //==================================

  objectManager.objects.events.add("click", function (e) {
    var id = e.get("objectId"),
      geoObject = objectManager.objects.getById(id);

    removeInfoPanel();

    openPoint = geoObject;

    $("#main-map-content").append(infoPanel);

    $("#img_").attr("src", "imgs/" + geoObject.properties.image);

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

  objectBuffer.objects.events.add("click", function (e) {
    resetBuffer = true;

    var id = e.get("objectId"),
      geoObject = objectBuffer.objects.getById(id);

    removeInfoPanel();

    openPoint = geoObject;

    $("#main-map-content").append(infoPanel);

    $("#img_").attr("src", "imgs/" + geoObject.properties.image);

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

    /*objectManager.objects.each(function (obj) {
      if (obj.properties.averageTime) {
        objectBuffer.add(obj);
        objectManager.objects.remove(obj);
      }
    });

    placesCollection.add(objectBuffer);
    foodCollection.add(objectManager);*/

    myMap.geoObjects.each(function (object) {
      object.options.set({ hasBalloon: false });
    });
  });
}

function removeLastPlacemark() {
  myMap.geoObjects.remove(
    myMap.geoObjects.get(myMap.geoObjects.getLength() - 1)
  );

  addPlacemarkButton.deselect();
  routeButton.deselect();
}

function removeAddPlacemarkForm() {
  $(".map-obj_creat").remove();
}

function removeInfoPanel() {
  openPoint = null;
  $(".map-obj").remove();
}

function removeRoutePanel() {
  $(".ourRoute").remove();
  myMap.geoObjects.remove(multiRoute);
  routeButton.deselect();
}

//===========================
//Функции добавления маршрута
//===========================

function showMultiRoute() {
  myMap.geoObjects.remove(multiRoute);

  multiRoute = new ymaps.multiRouter.MultiRoute(
    {
      referencePoints: routePointsCoordinates,
      params: { routingMode: "pedestrian" },
    },
    {
      boundsAutoApply: true,
    }
  );

  myMap.geoObjects.add(multiRoute);

  let foodPlaces, fullTime;
  routePointsFull.forEach((element) => {
    if (element.properties.averageTime) {
      fullTime += parseInt(element.properties.averageTime);
    } else {
      fullTime = 0;
    }
  });

  if (fullTime >= 2) {
    if (
      confirm(
        "Ваш маршрут займет более " +
          fullTime +
          " часов. Выберем место, чтобы перекусить?"
      )
    ) {
      showNearFoodPlaces();
    }
  }
}

function clearMultiRoute() {
  myMap.geoObjects.remove(multiRoute);
  routePointsCoordinates = [];
  routePointsFull = [];
  removeRoutePanel();
}

function showNearFoodPlaces() {
  var nearFoodPlaces = [];

  routePointsFull.forEach((element) => {
    var circle = new ymaps.Circle(
      [element.geometry.coordinates, 300],
      {},
      {
        fill: false,
        outline: false,
      }
    );

    myMap.geoObjects.add(circle);

    let objects = ymaps.geoQuery(objectManager.objects).searchInside(circle);

    objects.each(function (e) {
      if (e.properties.get("sum"))
        if (!routePointsCoordinates.includes(e.geometry.getCoordinates())) {
          nearFoodPlaces.push(e);

          objectManager.objects.each(function (object) {
            if (object.geometry.coordinates == e.geometry.getCoordinates())
              objectBuffer.add(object);
          });
        }
    });
  });

  myMap.geoObjects.remove(objectManager);
  objectBuffer.add(routePointsFull);
  myMap.geoObjects.add(objectBuffer);

  myMap.geoObjects.each(function (object) {
    object.options.set({ hasBalloon: false });
  });
}

function addPointToRoute() {
  if (resetBuffer) {
    objectBuffer.removeAll();
    myMap.geoObjects.remove(objectBuffer);
    myMap.geoObjects.add(objectManager);
    routePointsFull.push(openPoint);
    routePointsCoordinates.push(openPoint.geometry.coordinates);
    removeInfoPanel();
    showMultiRoute();
    showRoutePoints();
    return;
  }

  if (openPoint != null) {
    routePointsFull.push(openPoint);
    routePointsCoordinates.push(openPoint.geometry.coordinates);
  }

  alert("Точка добавлена в маршрут.");
}

function showRoutePoints() {
  $(".push").empty();

  let i = 1;
  routePointsFull.forEach((element) => {
    $(".push").append(
      "<li class='route-point-" +
        i +
        "'><p>" +
        element.properties.balloonContentHeader +
        '</p><br /><i class="fas fa-map-marker"></i>' +
        element.properties.address +
        "<br /><p>Открыто до " +
        element.properties.close_time +
        '</p><div><i class="bi bi-chevron-compact-up"></i>' +
        '<i class="bi bi-chevron-compact-down"></i>' +
        '<i class="bi bi-x-lg"></i></div>' +
        "</li>"
    );
    i++;
  });

  $(".push").append("<li class='route-end'><p>Конец маршрута.</p></li>");
}

$("body").on("click", ".bi-chevron-compact-up", function () {
  let item = parseInt($(this).parent().parent().attr("class").substr(-1)) - 1;
  if (item != 0) {
    let prevItem = routePointsCoordinates[item - 1];
    routePointsCoordinates[item - 1] = routePointsCoordinates[item];
    routePointsCoordinates[item] = prevItem;

    prevItem = routePointsFull[item - 1];
    routePointsFull[item - 1] = routePointsFull[item];
    routePointsFull[item] = prevItem;
  }
  showRoutePoints();
  showMultiRoute();
});

$("body").on("click", ".bi-chevron-compact-down", function () {
  let item = parseInt($(this).parent().parent().attr("class").substr(-1)) - 1;
  if (item != routePointsCoordinates.length - 1) {
    let nextItem = routePointsCoordinates[item + 1];
    routePointsCoordinates[item + 1] = routePointsCoordinates[item];
    routePointsCoordinates[item] = nextItem;

    nextItem = routePointsFull[item + 1];
    routePointsFull[item + 1] = routePointsFull[item];
    routePointsFull[item] = nextItem;
  }
  showRoutePoints();
  showMultiRoute();
});

$("body").on("click", ".bi-x-lg", function () {
  let item = parseInt($(this).parent().parent().attr("class").substr(-1)) - 1;
  routePointsCoordinates.splice(item, 1);
  routePointsFull.splice(item, 1);
  if (routePointsCoordinates.length == 0) {
    removeRoutePanel();
  } else {
    showRoutePoints();
  }
});

//==================================
//**********************************
//==================================

//========================
//Функции добавления меток
//========================

function updateDataJSON() {
  /*ymaps
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
    });*/

  newPlacemark.properties.set({
    balloonContentHeader: $('#form input[name="name"]').val(),
    balloonContentBody: $('#form textarea[name = "description"]').val(),
    address: $('#form input[name = "address"]').val(),
    open_time: $('#form input[name="open-time"]').val(),
    close_time: $('#form input[name="close-time"]').val(),
    link: $('#form input[name="link"]').val(),
    image: $("#foto")[0].value.split("\\").pop(),
  });

  if (isPlace) {
    newPlacemark.properties.set({
      averageTime: $('#form input[name="averageTime"]').val(),
      tags: $('#form select[name="place[]"]').val(),
    });
    newPlacemark.options.set({
      iconLayout: "default#image",
      iconImageHref: "imgs/marker_red.png",
      iconImageSize: [30, 45],
      iconImageOffset: [-15, -45],
    });
  } else {
    newPlacemark.properties.set({
      sum: $('#form input[name="sum"]').val(),
      tags: $('#form select[name="food[]"]').val(),
    });
    newPlacemark.options.set({
      iconLayout: "default#image",
      iconImageHref: "imgs/food.png",
      iconImageSize: [40, 40],
      iconImageOffset: [-20, -20],
    });
  }

  let data = JSON.stringify(converPlacemark(newPlacemark));

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
      image: placemark.properties.get("image"),
    },
    options: {
      iconLayout: placemark.options.get("iconLayout"),
      iconImageHref: placemark.options.get("iconImageHref"),
      iconImageSize: placemark.options.get("iconImageSize"),
      iconImageOffset: placemark.options.get("iconImageOffset"),
      preset: placemark.options.get("preset"),
    },
  };

  return obj;
}

/*$("#form").on("submit", function (e) {
  e.preventDefault();

  $.ajax({
    url: "upload_image.php",
    type: "POST",
    data: new FormData(this),
    contentType: false,
    processData: false,
  });
});*/

//========================
//************************
//========================

//===========================
//Функции скачивания маршрута
//===========================

function saveRoute() {
  $("ul li").each(function () {
    $(this).append("<textarea></textarea>");
  });
  $(".route-end textarea").remove();
  $("#save-route").remove();
  $("#buttons").append(
    '<a id="download-route" onclick="downloadRoute()">Скачать маршрут</a>'
  );
}

function downloadRoute() {
  let i = 1;
  let li = ".route-point-" + i;
  let text = "";
  routePointsFull.forEach((element) => {
    text +=
      i +
      ") " +
      element.properties.balloonContentHeader +
      "\n" +
      element.properties.address +
      "\n" +
      element.properties.close_time +
      "Примечание: " +
      $(li + " textarea").val() +
      "\n\n\n";
    i++;
    li = ".route-point-" + i;
  });

  downloadAsFile(text);
}

function downloadAsFile(data) {
  let a = document.createElement("a");
  let file = new Blob([data], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "Маршрут.txt";
  a.click();
  a.remove();
}

//==========================
//**************************
//==========================
