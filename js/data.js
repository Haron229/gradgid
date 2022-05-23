var places = [
  {
    "id": 1,
    "latitude": 51.558543,
    "longitude": 46.076468,
    "name": "памятник Журавли",
    "place": "г. Саратов, Волжский район",
    "stories_ids": [],
    "food": [],
    "views": 12,
    "photo": "imgs/juravli.jpg"
  },
  {
    "id": 2,
    "latitude": 58.517582,
    "longitude": 31.269709,
    "name": "Церковь Власия, епископа Севастийского",
    "place": "Новгородский кремль",
    "stories_ids": [1],
    "food": [],
    "views": 12,
    "photo": "imgs/vl.JPG"
  },
  {
    "id": 3,
    "latitude": 58.520286,
    "longitude": 31.280677,
    "name": "Кремлевский мост",
    "place": "Новгородский кремль",
    "stories_ids": [1],
    "food": [
      {
        "latitude": 58.520830,
        "longitude": 31.282278,
        "type": "Ресторан",
        "name": "Флагман",
        "check": 1500
      }
    ],
    "views": 10,
    "photo": "imgs/most.jpg"
  },
  {
    "id": 5,
    "latitude": 58.486363,
    "longitude": 31.284658,
    "name": "Свято-Юрьев мужской монастырь",
    "place": "Где-то",
    "stories_ids": [1],
    "food": [],
    "views": 10,
    "photo": "imgs/yurev.jpg"
  },
  {
    "id": 6,
    "latitude": 58.522816,
    "longitude": 31.276366,
    "name": "Грановитая палата",
    "place": "Новгородский кремль",
    "stories_ids": [1],
    "food": [],
    "views": 9,
    "photo": "imgs/palata.jpg"
  },
  {
    "id": 7,
    "latitude": 58.275166,
    "longitude": 31.316295,
    "name": "озеро Ильмень",
    "place": "Новгородская область",
    "stories_ids": [3],
    "food": [],
    "views": 9,
    "photo": "imgs/ilm.jpg"
  },
  {
    "id": 8,
    "latitude": 51.529776,
    "longitude": 46.034172,
    "name": "Саратовская государственная консерватория",
    "place": "г. Саратов, просп. Кирова, 1",
    "stories_ids": [0],
    "food":  [
      {
        "latitude": 51.530906,
        "longitude": 46.035900,
        "type": "Мороженое",
        "name": "Баскин Роббинс",
        "check": 900
      },
      {
        "latitude": 51.529968,
        "longitude": 46.037163,
        "type": "Винотека",
        "name": "Квартира 98",
        "check": 400 - 700
      },
      {
        "latitude": 51.530906,
        "longitude": 46.035900,
        "type": "Мороженое",
        "name": "Баскин Роббинс",
        "check": 900
      }
    ],
    "views": 31,
    "photo": "imgs/conservatoria.jpg"
  }
];

var stories = [
  {
    "id": 1, // Главная легенда про Иоанна
    "name": "Легенда про Иоанна и беса",
    "link": "legend.html",
    "tags": ["Иоанн", "бес", "Мост", "Мистика"],
    "isPath": true
  },
  {
    "id": 2, // Главная легенда про Иоанна
    "name": "Легенда о Голубе",
    "link": "",
    "tags": ["Мост", "Мистика"],
    "isPath": false
  },
  {
    "id": 3, // Главная легенда про Иоанна
    "name": "Легенда о Двух Братьях",
    "link": "",
    "tags": ["Мост", "Мистика", "Романтика"],
    "isPath": false
  },
]
