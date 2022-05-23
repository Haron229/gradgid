ymaps.ready(init);

var myMap, region;
var clusterer;
var multiRoute;
var onMap_objs = [],
  geoobjs_obj = [];
var onMap_rests = [],
  geoobjs_rests = [];

var tag = window.location.hash.substr(1);

function init() {
  //Создание карты
  var myMap = new ymaps.Map(
      "map",
      {
        center: [51.533562, 46.034266],
        zoom: 7,
        controls: ["zoomControl", "geolocationControl", "typeSelector"],
      },
      {
        //Ограничение области видимости карты
        restrictMapArea: [
          [-85, -179],
          [85, 179],
        ],
      }
    ),
    objectManager = new ymaps.ObjectManager({
      // Чтобы метки начали кластеризоваться, выставляем опцию.
      clusterize: true,
      // ObjectManager принимает те же опции, что и кластеризатор.
      gridSize: 64,
      // Макет метки кластера pieChart.
      clusterIconLayout: "default#pieChart",
    });
  
  myMap.geoObjects.add(objectManager);

  // Создадим 5 пунктов выпадающего списка.
  var listBoxItems = ["Школа", "Аптека", "Магазин", "Больница", "Бар"].map(
      function (title) {
        return new ymaps.control.ListBoxItem({
          data: {
            content: title,
          },
          state: {
            selected: true,
          },
        });
      }
    ),
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
        expanded: true,
        filters: listBoxItems.reduce(reducer, {}),
      },
    });

  myMap.controls.add(listBoxControl, {
    float: left,
  });

  listBoxControl.events.add(["select", "deselect"], function (e) {
    var listBoxItem = e.get("target");
    var filters = ymaps.util.extend({}, listBoxControl.state.get("filters"));
    filters[listBoxItem.data.get("content")] = listBoxItem.isSelected();
    listBoxControl.state.set("filters", filters);
  });

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add("filters", function (filters) {
    objectManager.setFilter(getFilterFunction(filters));
  });

  function getFilterFunction(categories) {
    return function (obj) {
      var content = obj.properties.balloonContent;
      return categories[content];
    };
  }

  //Скрытие пункта панорам
  myMap.controls.get("typeSelector")._panoramasItem.onRemoveFromMap();

  //myMap.container.fitToVeiwport();
  //myMap.copyrights.add("Vasya Pupkin");

  //Выделение региона
  //makeBorder();

  /*//Создание кластеризатора
  clusterer = new ymaps.Clusterer({
    clusterIcons: [
      {
        href: "imgs/star.png",
        size: [70, 70],
        offset: [-20, -20],
      },
    ],
    clusterIconContentLayout: null,
  });

  //Загрузка маркеров
  if (tag.length > 0) {
    console.log("Тег " + tag + " Иду в фильтры");
    let p_tag = filterByParam(tag);
    imagineParam(p_tag);
  } else {
    console.log("Тегов нет. Гружу все.");
    for (var i = 0; i < places.length; i++) {
      makeMarkers(places[i], i);
    }
  }

  //myMap.geoObjects.add(clusterer);*/
}

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

var t;

function makeMarkers(tale, i) {
  geoobjs = new ymaps.Placemark(
    [tale.latitude, tale.longitude],
    {
      hintContent: tale.name,
      // balloonContent: "<div>"+tale.name + "<br> " + tale.place + "<br> " + "<button>Подробнее</button>" + "</div>"
    },
    {
      iconLayout: "default#image",
      iconImageHref: "imgs/star.png",
      iconImageSize: [62, 62],
    }
  );

  t = tale;
  geoobjs.events.add(
    "click",
    function (e) {
      console.log(i);
      fillPop(i);
      showPop();
    },
    i
  );

  clusterer.add(geoobjs);

  onMap_objs[onMap_objs.length] = tale;
  geoobjs_obj[geoobjs_obj.length] = geoobjs;
  // myMap.geoObjects.add(geoobjs);
  // makeMark0rs_food(tale);
}

function makeMarkers_food(tale) {
  console.log(tale);
  for (var i = 0; i < tale.food.length; i++) {
    geoobjs = new ymaps.Placemark(
      [tale.food[i].latitude, tale.food[i].longitude],
      {
        hintContent: tale.food[i].type + " " + tale.food[i].name,
        balloonContent:
          "<div class='restaruant'><span class='h3'>" +
          tale.food[i].type +
          " " +
          tale.food[i].name +
          "</span><br>" +
          "<span class='c'>средний чек " +
          tale.food[i].check +
          " рублей</span></div>",
      },
      {
        iconLayout: "default#image",
        iconImageHref: "imgs/food.png",
        iconImageSize: [40, 40],
      }
    );
    myMap.geoObjects.add(geoobjs);
    onMap_rests = tale;
    geoobjs_rests[geoobjs_rests.length] = geoobjs;
  }
}

function toggleRests(checkbox) {
  if ($(checkbox).is(":checked")) {
    showRests();
  } else {
    hideRests();
  }
}

function hideRests() {
  myMap.geoObjects.each(function (el) {
    el.options.set("visible", false);
    myMap.geoObjects.add(clusterer);
    // myMap.geoObjects.add(m)3
    region.addToMap(myMap);
    // if (el.geometry) {
    //   console.log('содержит');
    // }
  });
}

function showRests() {
  for (var i = 0; i < onMap_objs.length; i++) {
    makeMarkers_food(onMap_objs[i]);
  }
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

// var geoobjs_;
var place;
var user_geo;
function game_start() {
  // скрыть все метки
  // geoobjs_ = myMap.geoObjects;
  // myMap.geoObjects.options.set('visible', 'false');
  myMap.geoObjects.removeAll();
  clusterer.removeAll();
  let index = randomInteger(0, places.length - 1);
  place = places[index];
  console.log("Место: " + place.name);
  let str = place.name;
  let html = `
        <div class="mini-game-task">
          <div>
            <h6>Задание</h6>
            <hr>
            <div class="task">
              Отметьте на карте <span>${str} </span>
            </div>
          </div>

        </div>
        <div class="mini-game-finished" onclick='stopminigame()'>Готово</div>`;
  $("#main-map-content").append(html);
  // $('#logo').attr("onclick", "stopminigame('')")
  // myMap.geoObjects.remove(geoobjs_obj);
  // показать одну метку которую будем двигать
  geoobjs = new ymaps.Placemark(
    [58.522857, 31.26981],
    {
      hintContent: "Подвиньте иконку в нужное место",
    },
    {
      iconLayout: "default#image",
      iconImageHref: "imgs/church.png",
      iconImageSize: [62, 62],
      draggable: true,
    }
  );

  myMap.geoObjects.add(geoobjs);
  user_geo = geoobjs;
  // найти правильный ответ в данных
  // сравнить
  // окошко для почты
}

function stopminigame() {
  console.log("stop");
  $("#main-map-content .mini-game-task").remove();
  $("#main-map-content .mini-game-finished").remove();

  console.log(user_geo);
  console.log(place);

  console.log(user_geo.geometry.getCoordinates());

  let long =
    Math.abs(user_geo.geometry.getCoordinates()[1] - place.longitude) * 100;
  let lat =
    Math.abs(user_geo.geometry.getCoordinates()[0] - place.latitude) * 100;

  console.log(long + " " + lat);

  myobj = new ymaps.Placemark(
    [place.latitude, place.longitude],
    {
      hintContent: "Правильный ответ",
    },
    {
      iconLayout: "default#image",
      iconImageHref: "imgs/star.png",
      iconImageSize: [62, 62],
    }
  );

  myMap.geoObjects.add(myobj);

  if (long > lat) {
    game_results(long);
  } else game_results(lat);
}

function game_results(max) {
  let html = "";
  if (max > 20) {
    // плохо.
    html = `
              <div class="mini-game-result">
                <div>
                  <h6>Результат</h6>
                  <hr>
                  <div class="task">
                    Очень далеко <i class="fas fa-sad-tear"></i>
                  </div>
                  <hr>
                  <div>Вы не смогли выиграть бонусы.</div>
                  <a href="#" onclick='game_send_mail()'>ОК</a>
                </div>
              </div>`;
  } else if (max > 5) {
    // пойдет, 5%
    html = `
              <div class="mini-game-result">
                <div>
                  <h6>Результат</h6>
                  <hr>
                  <div class="task">
                    Вы - молодец! <i class="fas fa-smile-beam"></i>
                  </div>
                  <hr>
                  <div>Введите e-mail, на который будет отправлены бонусы (5%)</div>
                  <div class="game-feed-back" >
                    <input type="mail" name="mail">
                    <a href="#" onclick='game_send_mail()'>ОК</a>
                  </div>
                </div>
              </div>`;
  } else if (max <= 5) {
    // молодец, 10%
    html = `
              <div class="mini-game-result">
                <div>
                  <h6>Результат</h6>
                  <hr>
                  <div class="task">
                    Отличный результат! <i class="fas fa-laugh-wink"></i>
                  </div>
                  <hr>
                  <div>Введите e-mail, на который будет отправлены бонусы (10%)</div>
                  <div class="game-feed-back">
                    <input type="mail" name="mail">
                    <a href="#" onclick='game_send_mail()'>ОК</a>
                  </div>
                </div>
              </div>`;
  }
  $("#main-map-content").append(html);
}

function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function game_send_mail() {
  $("#main-map-content .mini-game-result").remove();

  location.reload();
}
