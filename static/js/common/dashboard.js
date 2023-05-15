// Query Text color
const blueText = ['DROP','CREATE','TABLE','SEQUENCE','NOT','NULL','DEFAULT', 'CONSTRAINT', 'PRIMARY', 'KEY', 'UNIQUE',"SELECT","from"]
const yellowText = ['nextval', 'integer', '::regclass','timestamp','text', 'varchar']



// swiper 배너
$(document).ready(function () {
    var mySwifer = new Swiper('.swiper-container', {
      slidesPerView: 8,
      spaceBetween: 30,
      slidesPerGroup: 1,
      loopFillGroupWithBlank: true,
      loop: true,
      autoplay: {
          delay: 1000,
          disableOnInteraction: false,
        },
      breakpoints: {
          0: {
              slidesPerView: 1,
          },
          520: {
              slidesPerView: 2,
          },
          950: {
              slidesPerView: 3,
          },
          1000: {
              slidesPerView: 4,
          },
          1700: {
              slidesPerView: 6,
          },
          1920: {
            slidesPerView: 8,
          },
      },
  })
    $('.swiper-slide').hover(function(){
        mySwifer.autoplay.stop();
      }, function(){
        mySwifer.autoplay.start();
    });
});


$(document).ready(function () {
  // X-factor DF
    $(".btn-dataNavi").on('click', function () {
        $(".btn-dataNavi").removeClass("active");
        $(this).addClass("active");
    });
    const textBoxHover = function(){
        $(".table-textBox").on({
            'mouseover':function(){
                $(this).addClass("textBox-scroll")
            },
            'mouseout':function(){
                $(this).removeClass("textBox-scroll")
            }
        });
    };

    $(".btn-tableProperties").on('click', function () {
  //    Data Columns View Procedure DDL
        const tableProperties = ['Data', 'Column', 'View', 'Procedure', 'DDL']
        $(".btn-tableProperties").removeClass("active");
        $(this).addClass("active");
        let btnText = $(this).text()
        tableProperties.forEach(function(element){
            if (btnText === element) {
                $('.properties').css("display","none");
                $(".properties-" + element).css("display","table");

                $(".TableProperties").css("display","table");
              }
          });
          textBoxHover()
    });



  let qTab = $('.query-tabs').children().last();
  let cTab = $('.query-tabContent').children().last();
  let delBtn = qTab.children().children().last();
  let number = 2;
  let idArray = new Array(10).fill(null);
  let cacheArray = [];
  idArray[0] = 'Query1';
  cacheArray[0] = 'Query1';
  $("#addScript").on('click', function () {
    let qHasClass = 0;
    let cHasClass = 0;
    if (number <= 10){
      if(cTab.hasClass("active") === true) {
        cTab.removeClass('active');
        cTab.removeClass('show');
        cTab.removeClass('active');
        cHasClass++;
      }
      if(qTab.children().hasClass("active") === true) {
        qTab.children().last().removeClass('active');
        qHasClass++;
      }
      delBtn = qTab.children().children().last().clone(true);
      qTab = $('.query-tabs').children().last().clone(true);
      cTab = $('.query-tabContent').children().last().clone(true);

      if(cHasClass === 1){
        cTab.addClass('active');
        cTab.addClass('show');
        cTab.addClass('active');
      }

      if(qHasClass === 1){
        qTab.children().last().addClass('active');
      }

      qTab.appendTo($('.query-tabs'));
      cTab.appendTo($('.query-tabContent'));

      for (let i = 0; i < idArray.length; i++) {
        if (idArray[i] === null) {
          cTab.attr('id', 'Query' + (i + 1));
          idArray[i] = 'Query' + (i + 1);
          cTxt = cTab.children().children().val('');
          
          qTab.children().last().text(idArray[i]);
          //쿼리창 한글변환
          var replacetext = idArray[i]
          replacetext = replacetext.replace('Query', '쿼리창-');
          //

          qTab.children().last().text(replacetext); // 변경전 idArray[i] 
          qTab.children().last().attr('href', '#' + idArray[i]);
          qTab.children().last().attr('id', 'query_' + idArray[i]);
          delBtn.appendTo($('.query-tabs').children().last().children());
          cacheArray.push('Query' + (i + 1));
          break;
        }
      }
      number++;
    } else {
      $('#alertQueryNot').modal('show');
    }
  });

  $(".delScript").on('click',function(){
  if (number > 2){
    let activeTab = document.querySelector(".tab-content .query-box.show"); // 활성화된 탭의 nav-link 요소
    let activeTabId = activeTab.getAttribute("id"); // 활성화된 탭의 ID 가져오기
    delQuery = $(this).parent().attr("href").replace('#','')
    delQueryBtn = $(this).parent().parent()

    let delQueryTab = $('#'+delQuery)
    for (let i = 0; i < idArray.length; i++) {
      if (idArray[i] === delQuery) {
        for(let j = 0; j < cacheArray.length; j++) {
            if (cacheArray[j] === idArray[i]) {
              cacheArray.splice(j, 1);
              index = j;
              if (index == cacheArray.length){
                index = index - 1
              }
            }
        }
      
      idArray[i] = null
      delQueryTab.remove()
      delQueryBtn.remove()
      if (activeTabId != delQuery){
        $('#query_'+activeTabId).attr('class', 'nav-link change-link queryBtn active show');
        $('#'+activeTabId).attr('class', 'query-box tab-pane active show');
      }else {
        $("a[href$='#"+ cacheArray[index] +"']").attr('class', 'nav-link change-link queryBtn active');
        $('#'+cacheArray[index]).attr('class', 'query-box tab-pane active show');
      }

      qTab = $('.query-tabs').children().last()
      cTab = $('.query-tabContent').children().last()
      break;
      }
    }
  number--;
  }
  });
});




