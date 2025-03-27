/*slider brands*/
		$(document).ready(function(){
			$('.customer-logos').slick({
				slidesToShow: 6,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 1000,
				arrows: false,
				dots: false,
					pauseOnHover: false,
					responsive: [{
					breakpoint: 768,
					settings: {
						slidesToShow: 4
					}
				}, {
					breakpoint: 520,
					settings: {
						slidesToShow: 3
					}
				}]
			});
		});

/*show offerte aanvragen button on scroll*/
$(window).scroll(function(){
  if($(window).scrollTop() > 30){
      $("#offerscrollbutton").fadeIn("slow");
  }
});

$(window).scroll(function(){
  if($(window).scrollTop() < 30){
      $("#offerscrollbutton").hide();
  }
});
