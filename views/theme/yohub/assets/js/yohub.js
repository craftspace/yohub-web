$('body.service-page').on('click', '.show-detail', function () {
  var $t = $(this).parent().find('table');
  $t.hasClass('hide') ? $t.removeClass('hide') : $t.addClass('hide');
});

$('#contact_form .date').datepicker({
  'format': 'm/d/yyyy',
  'autoclose': true
});

$('#contact_form_submit').on('click', function () {
  var form = $('#contact_form');
  var contact = {
    name: form[0].name.value,
    corp: form[0].corp.value,
    email: form[0].email.value,
    mobile: form[0].mobile.value,
    tel: form[0].tel.value,
    place: form[0].place.value,
    start: form[0].start.value,
    end: form[0].end.value,
    industry: form[0].industry.value,
    desc: form[0].desc.value,
    level: form.find(':checked')
  };
  if (!contact.corp) {
    alert('公司名称还没有填写');
    return;
  }
  if (!contact.name) {
    alert('联系人还没有填写');
    return;
  }
  if (!(contact.email || contact.mobile || contact.tel)) {
    alert('手机|办公电话|电子邮件 至少填写一个');
    return;
  }
  if (!contact.start || !contact.end) {
    alert('起止时间还没有填写完整');
    return;
  }
  if (!contact.place) {
    alert('服务地点还没有填写');
    return;
  }
  if (!contact.industry) {
    alert('所属行业还没有填写');
    return;
  }
  if (!contact.level.length) {
    alert('专家类型还没有选择');
    return;
  }

  $('#contact_form').submit();
});