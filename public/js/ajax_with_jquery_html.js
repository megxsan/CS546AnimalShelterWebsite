(function ($) {
  // Let's start writing AJAX calls!

  //Let's get references to our form elements and the div where the todo's will go
  let myNewCommentForm = $('#comment-form'),
    commentInput = $('#commentInput'),
    commentArea = $('#comment-area'),
    dogId = $('#dogId');

  //new comment form submission event
  myNewCommentForm.submit(function (event) {
    event.preventDefault();

    let comment = commentInput.val();

    if (comment) {
      //set up AJAX request config
      let requestConfig = {
        method: 'POST',
        url: '/dogs/' + dogId.val() + '/comment',
        contentType: 'application/json',
        data: JSON.stringify({
          comment: comment
        })
      };
      //AJAX Call.
      $.ajax(requestConfig).then(function (responseMessage) {
        let newElement = $(responseMessage);
        commentArea.append(newElement);
        commentInput.val('');
        commentInput.focus();
      });
    }
  });
})(window.jQuery);
