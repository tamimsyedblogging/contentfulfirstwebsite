$('div.markdown img').addClass('img-responsive');


//$( "div.markdown p img" ).replaceWith( htmlReplace );

$( "div.markdown p img" ).each(function( index ) {
  var htmlReplace = "<div class=\"center\"><picture><source media=\"(min-width: 465px)\" srcset=\""+$( this ).attr("src")+"?w=400&h=400\"><source media=\"(min-width: 800px)\" srcset=\""+$( this ).attr("src")+"?w=700&h=600\"><source media=\"(min-width: 1200px)\" srcset=\""+$( this ).attr("src")+"?w=900&h=600\"><img src=\""+$( this ).attr("src")+"?w=345&h=250\"></picture></div>";
  $( this ).replaceWith(htmlReplace);
  console.log(htmlReplace);
});
