var todaysDate = moment().format('ddd DD YYYY');
$(".day").html(todaysDate);


 
function date () {
    $(".days").each(function () {
        for (i=1; i<6; i++) {
            var new_date = moment().add(i,'d').format('ddd DD');
            $("#card-title"+i).html(new_date)
        }

    })
}
//calls the date function
date();
