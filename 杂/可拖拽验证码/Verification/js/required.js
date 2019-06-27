/**
 * Created by Web Develop on 2017/3/7.
 */
(function () {
      function testRequired(Docment) {
          $(Docment).on('focusout', function () {
              var regEx = /^[A-Za-z ]+$/;
              if (!regEx.test($(this).val()) && $(this).attr('alert-text') !== undefined) {
                  $(this).parent().parent().addClass('has-error');
                  $(this).siblings('span.smk-error-msg').remove();
                  $(this).parent().append("<span class='smk-error-msg'>" + $(this).attr('alert-text') + "</span>");
              } else {
                  $(this).parent().parent().removeClass('has-error');
                  $(this).siblings('span.smk-error-msg').remove();
              }
          })
      }
      testRequired(".requiredTest");
      function testSelect(Docum) {
          $(Docum).on('focusout', function () {
              if ($(this).val() == "" && $(this).attr('alert-text') !== undefined) {
                  $(this).parent().parent().addClass('has-error');
                  $(this).siblings('span.smk-error-msg').remove();
                  $(this).parent().append("<span class='smk-error-msg'>" + $(this).attr('alert-text') + "</span>");
              } else {
                  $(this).parent().parent().removeClass('has-error');
                  $(this).siblings('span.smk-error-msg').remove();
              }
          })
      }
      testSelect(".getCountry");
})();