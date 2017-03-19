const apiKey = config.API_Key;

function readFeeds() {
	var blogFeeds = ["https://www.alvinashcraft.com/feed/", "https://blog.codinghorror.com/rss/", "https://visualstudiomagazine.com/rss-feeds/news.aspx", "https://visualstudiomagazine.com/rss-feeds/practical-net.aspx"];
	blogFeeds.forEach(function(element) {
		$.ajax({
			url: 'https://api.rss2json.com/v1/api.json',
			method: 'GET',
			dataType: 'json',
			data: {
				rss_url: element,
				api_key: apiKey,
				count: 5
			}
		}).done(function(response) {
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