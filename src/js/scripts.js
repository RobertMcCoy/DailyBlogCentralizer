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
                    count: 5,
                    order_by: 'pubDate',
                    order_dir: 'desc'
                }
            }).done(function (response) {
                if (response.status != 'ok') {
                    throw response.message;
                }
                var tableRows = generateTableRows(response);
                var newDiv = document.createElement('div');
                document.getElementById('tables').appendChild(newDiv);
                newDiv.id = 'div' + replaceAll(response.feed.title, " ", "")
                newDiv.innerHTML = '<h1>' + response.feed.title + '</h1><p><a href="' + response.feed.link +'">' + response.feed.link + '</a></p><h4>' + response.feed.description + ' </h4><br/>' +
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

function readPodcasts() {
    if (localStorage.getItem('podcasts') !== null && localStorage.getItem('podcasts').length !== 0) {
        JSON.parse(localStorage.getItem('podcasts')).forEach(function (element) {
            $.ajax({
                url: 'https://api.rss2json.com/v1/api.json',
                method: 'GET',
                dataType: 'json',
                data: {
                    rss_url: element,
                    api_key: apiKey,
                    count: 5,
                    order_by: 'pubDate',
                    order_dir: 'desc'
                }
            }).done(function (response) {
                if (response.status != 'ok') {
                    throw response.message;
                }
                var tableRows = generateTableRows(response);
                var newDiv = document.createElement('div');
                document.getElementById('tables').appendChild(newDiv);
                newDiv.id = 'div' + replaceAll(response.feed.title, " ", "")
                newDiv.innerHTML = '<h1>' + response.feed.title + '</h1><p><a href="' + response.feed.link +'">' + response.feed.link + '</a></p><h4>' + response.feed.description + ' </h4><br/>' +
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
    var table = "<table class='table table-hover table-bordered table-responsive'><tr><th>Feed URL</th><th></th></tr>";
    JSON.parse(localStorage.getItem('podcasts')).forEach(function (element) {
        table += "<tr><td>" + element + "</td><td><input type='button' onclick='deletePodcast(\"" + element + "\")' class='btn btn-warning' value='Delete' /></td></tr>";
    })
    table += "</table>";
    document.getElementById('podcastTable').innerHTML = table;
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

function deletePodcast(feed) {
    var feeds = JSON.parse(localStorage.getItem('podcasts'));
    var indexToRemove;
    for (var i = 0; i < feeds.length; i++) {
        if (feeds[i] === feed) {
            indexToRemove = i;
            break;
        }
    }
    feeds.splice(indexToRemove, 1);
    localStorage.setItem('podcasts', JSON.stringify(feeds))
    location.reload();
}

function generateTableRows(response) {
	var rows = "";
	response.items.forEach(function(element) {
		var date = new Date(element.pubDate);
		if (localStorage.getItem('colorCode') === "true") {
            if (isLinkViewed(element.link)) {
                rows += '<tr style="background-color: #EEF3E2">' +
                    '<td><a href="' + element.link + '" target="_blank">' + element.title + '</a></td>' +
                    '<td>' + (('0' + (date.getMonth() + 1)).slice(-2)) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ((date.getHours() + 11) % 12 + 1) + ':' + ('0' + date.getMinutes()).slice(-2) + (date.getHours() > 12 ? ' PM' : ' AM' ) + '</td>' +
                    '<td>' + element.author + '</td>' +
                    '</tr>';
            }
            else {
                rows += '<tr style="background-color: #FEE0C6">' +
                    '<td><a href="' + element.link + '" target="_blank" onclick="linkViewed(\'' + element.link + '\');">' + element.title + '</a></td>' +
                    '<td>' + (('0' + (date.getMonth() + 1)).slice(-2)) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ((date.getHours() + 11) % 12 + 1) + ':' + ('0' + date.getMinutes()).slice(-2) + (date.getHours() > 12 ? ' PM' : ' AM' ) + '</td>' +
                    '<td>' + element.author + '</td>' +
                    '</tr>';
            }
        }
        else {
            rows += '<tr>' +
                '<td><a href="' + element.link + '" target="_blank">' + element.title + '</a></td>' +
                '<td>' + (('0' + (date.getMonth() + 1)).slice(-2)) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ((date.getHours() + 11) % 12 + 1) + ':' + ('0' + date.getMinutes()).slice(-2) + (date.getHours() > 12 ? ' PM' : ' AM' ) + '</td>' +
                '<td>' + element.author + '</td>' +
                '</tr>';
        }
	});
	return rows;
}

function linkViewed(link) {
    localStorage.setItem(link, true);
}

function isLinkViewed(link) {
    if (localStorage.getItem(link)) {
        return true;
    }
    return false;
}

function savePreferences() {
    localStorage.setItem('colorCode', $('#colorSeen').is(':checked'))
}

function addNewFeed() {
    if ($('#newItemTxt').val() !== "") {
        isFeedValid();
    }
}

function addNewPodcast() {
    if ($('#newItemPodcast').val() !== "") {
        isPodcastValid();
    }
}

function isPodcastValid() {
    $.ajax({
        url: 'https://api.rss2json.com/v1/api.json',
        method: 'GET',
        dataType: 'json',
        data: {
            rss_url: $('#newItemPodcast').val(),
            api_key: apiKey,
            count: 5,
            order_by: 'pubDate',
            order_dir: 'desc'
        }
    }).done(function (response) {
        if (response.status === 'ok') {
            addPodcast();
        }
        else {
            $('#resultsPodcastDiv').html("Feed is invalid. Please ensure it is in XML format. The feed should give results when ran through <a href='https://rss2json.com/' target='_blank'>RSS2JSON</a> and not an error status");
        }
    });
}

function isFeedValid() {
    $.ajax({
        url: 'https://api.rss2json.com/v1/api.json',
        method: 'GET',
        dataType: 'json',
        data: {
            rss_url: $('#newItemTxt').val(),
            api_key: apiKey,
            count: 5,
            order_by: 'pubDate',
            order_dir: 'desc'
        }
    }).done(function (response) {
        if (response.status === 'ok') {
            addBlog();
        }
        else {
            $('#resultsDiv').html("Feed is invalid. Please ensure it is in XML format. The feed should give results when ran through <a href='https://rss2json.com/' target='_blank'>RSS2JSON</a> and not an error status");
        }
    });
}

function addPodcast() {
    var blogList = JSON.parse(localStorage.getItem('podcasts'));
    blogList.push($('#newItemPodcast').val());
    localStorage.setItem('podcasts', JSON.stringify(blogList));
    location.reload();
}

function addBlog() {
    var blogList = JSON.parse(localStorage.getItem('blogs'));
    blogList.push($('#newItemTxt').val());
    localStorage.setItem('blogs', JSON.stringify(blogList));
    location.reload();
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//json format:
//status,
//feed:{url, title, link, author, description, image}
//items{title, pubDate, link, guid, author, thumbnail, description, content, enclosure[], categories[]}