define(function(require, exports, module) {

    var JobData = {
        jobs: {},
        fetch: function(url, page, callback) {
            $.ajax({
                url: url,
                jsonp: "callback",
                type: 'GET',
                dataType: "jsonp",
                data: {
                    per_page: 50,
                    page: page,
                    format: "json",
                    order: "createdAt"
                },
                success: function(data) {
                    callback(data, page);

                },
                error: function() {
                    alert('Unable to fetch');
                }
            });
        },


        intro: function(url, note) {
            $.ajax({
                url: url,
                jsonp: "callback",
                type: 'POST',
                dataType: "jsonp",
                data: note,
                success: function() {
                  console.log(success)
                },
                error: function() {
                    alert('Unable to send request!');
                }
            });
        }

    }


    module.exports = JobData;
});
