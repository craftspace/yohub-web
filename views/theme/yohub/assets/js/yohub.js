$('body.service-page').on('click', '.show-detail', function () {
  var $t = $(this).parent().find('table');
  $t.hasClass('hide') ? $t.removeClass('hide') : $t.addClass('hide');
});