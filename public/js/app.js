$(document).ready(function() {
  $("#delete-tag").click(function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr("href"),
      method: "DELETE"
    }).success(function(data){
      window.location.href = "/tags";
    });
  });

  $("#delete-post").click(function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr("href"),
      method: "DELETE"
    }).success(function(data){
      window.location.href = "/";
    });
  });

  $("#edit-tag").submit(function(e){
    e.preventDefault();
    $.ajax({
      url: $(this).attr("action"),
      method: "PUT",
      data: {
        name: $("#name").val()
      }
    }).success(function(data){
      window.location.href = "/";
    });
  })
});
