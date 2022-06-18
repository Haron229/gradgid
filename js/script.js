var i_;
var ids = [];
function fillPop(index) {

  emptyPop();
  i_ = index;
  closePop();
  tale = places[index];
  console.log(tale);
  $('div.map-obj h3.title').html(tale.name);
  $('div.map-obj div.geo span').html(tale.place);
  if (tale.food.length > 0) {
    $('div.map-obj .places .count_places').html(tale.food.length);
    $("div.map-obj .places").show();
    // $("a#show_").attr('onclick', 'showNear()');
  }
  $('div.map-obj div.eye span').html(tale.views);
  $('div.map-obj img#img_').attr('src', tale.photo);
  // legends
  let str = "";
  if (tale.stories_ids.length > 0) {

    for (var i = 0; i < tale.stories_ids.length; i++) {
      let is_in_ids = false;
      if (ids.length > 0) {
        is_in_ids = ids.includes(tale.stories_ids[i]);
      } else {
        is_in_ids = true;
      }
      console.log("IIIIIIII");
      console.log(tale.stories_ids[i]);
      let story;
      for (var j = 0; j < stories.length; j++) {
        console.log("JJJJJJJ");
        console.log(stories[j]);
        console.log("fav: ");
        console.log(ids);

        if (stories[j]['id'] == tale.stories_ids[i] && is_in_ids) {
          is_in_ids = false;
          story = stories[j];
        }
        if (story != undefined) {
          str = "<div class='legend'><a href='"+story.link+"'><div class='title'>"+story.name+"</div></a>";
          if (story.isPath) {
            str += '<span onclick="showPath()" style="margin-left: 10px"><i class="fas fa-route"></i></span>';
          }
          str+="</div>";
        }
      }
      $('div.legends').empty();
      $('div.legends').append(str);
    }
  }
}

function showPop() {
  $('div.map-obj').show();
}

function closePop() {
  $('div.map-obj').hide();
}


function emptyPop() {
  $('div.map-obj h3.title').html();
  $('div.map-obj div.geo span').html();
  $('div.map-obj .places .count_places').html();
  $('div.map-obj div.eye span').html();
  $('div.map-obj img#img_').attr('src', '');
  $('div.legends').html();
}

function showNear() {
  console.log(places);
  console.log(i_);
  makeMarkers_food(places[i_]);
}


function filterByParam(param) {
  console.log("Фильтры.");
  // param = "mistika"
  let p_tag = "";
  switch (param) {
    case 'parks':
      p_tag = "Парки";
      break;
    case 'monuments':
      p_tag = "Памятники";
      break;
    case 'entertainments':
      p_tag = "Развлечения";
      break;
    default:
  }
  console.log("на русском " + p_tag);

  // смотрим айдишники подходящих историй
  for (var i = 0; i < stories.length; i++) {
    let tags = stories[i].tags;
    console.log(tags);
    for (var j = 0; j < tags.length; j++) {
      console.log(tags[j]);
      if (tags[j].toLowerCase() == p_tag) {
        ids[ids.length] = stories[i].id;
        break;
      }
    }
  }
  console.log("подходящие: " + ids);

  // смотрим, какие из мест содержат подходящие истории
  for (var i = 0; i < places.length; i++) {
    for (var j = 0; j < places[i].stories_ids.length; j++) {
      for (var k = 0; k < ids.length; k++) {
        if (places[i].stories_ids[j] == ids[k]) {
          console.log("подходит " + places[i].id);
          makeMarkers(places[i], i);
        }
      }
    }
  }

  return p_tag;
}

function imagineParam(param) {
  // уже на русском
  console.log($('.tags.abs span.word'));
  $('.tags.abs span.word').html(param);
  console.log($('.tags.abs'));
  $('.tags.abs').show();
}

//открытие\закрытие формы авторизации
