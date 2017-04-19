const apiKey = config.API_Key;

function readFeeds() {
	if (localStorage.getItem('blogs') !== null && localStorage.getItem('blogs').length !== 0) {
        JSON.parse(localStorage.getItem('blogs')).forEach(function (element) {
            $.ajax({
                url: 'https://api.rss2json.com/v1/api.json',
                method: 'GET',
                dataType: 'json',
                data: {
                    rss_url: element,
                    api_key: apiKey,
                    count: 5
                }
            }).done(function (response) {
                if (response.status != 'ok') {
                    throw response.message;
                }
                var tableRows = generateTableRows(response);
                var newDiv = document.createElement('div');
                document.getElementById('tables').appendChild(newDiv);
                newDiv.id = 'div' + replaceAll(response.feed.title, " ", "")
                newDiv.innerHTML = '<h1>' + response.feed.title + '</h1><h4>' + response.feed.description + ' </h4><br/>' +
                    '<table class="table table-hover table-bordered table-striped">' +
                    '<tr>' +
                    '<th>Title</th>' +
                    '<th>Published</th>' +
                    '<th>Author</th>' +
                    '</tr>' +
                    tableRows +
                    '</table>';
            });
        });
    }
}

function generatePreferenceBlogs() {
	var table = "<table class='table table-hover table-bordered table-responsive'><tr><th>Feed URL</th><th></th></tr>";
	JSON.parse(localStorage.getItem('blogs')).forEach(function (element) {
		table += "<tr><td>" + element + "</td><td><input type='button' onclick='deleteFeed(\"" + element + "\")' class='btn btn-warning' value='Delete' /></td></tr>";
	})
	table += "</table>";
	document.getElementById('blogTable').innerHTML = table;
}

function deleteFeed(feed) {
	var feeds = JSON.parse(localStorage.getItem('blogs'));
	var indexToRemove;
	for (var i = 0; i < feeds.length; i++) {
		if (feeds[i] === feed) {
			indexToRemove = i;
			break;
		}
	}
	feeds.splice(indexToRemove, 1);
	localStorage.setItem('blogs', JSON.stringify(feeds))
	location.reload();
}

function generateTableRows(response) {
	var rows = "";
	response.items.forEach(function(element) {
		var date = new Date(element.pubDate);
		rows += '<tr>' +
					'<td><a href="' + element.link + '">' + element.title + '</a></td>' +
					'<td>' + (('0' + (date.getMonth() + 1)).slice(-2)) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ((date.getHours() + 11) % 12 + 1) + ':' + ('0' + date.getMinutes()).slice(-2) + (date.getHours() > 12 ? ' PM' : ' AM' ) + '</td>' +
					'<td>' + element.author + '</td>' +
				'</tr>';
	});
	return rows;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//json format:
//status,
//feed:{url, title, link, author, description, image}
//items{title, pubDate, link, guid, author, thumbnail, description, content, enclosure[], categories[]}