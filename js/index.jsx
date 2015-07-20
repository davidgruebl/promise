import React from 'react'
import Q from 'q'
import request from 'request'

var tags = []
var tagUrl = 'http://www.gifbase.com/tag/'
var tagsUrl = 'http://www.gifbase.com/js/tags.json'

function getTagList () {
  var deferred = Q.defer()
  request({url: tagsUrl, json: true}, function (err, response, body) {
    if (err) deferred.reject(new Error(err))
    if (response.statusCode === 200) {
      tags = body
      deferred.resolve(body.length)
    }
  })
  return deferred.promise
}

function selectTag (max) {
  var nr = Math.floor(Math.random() * (max - 0)) + 0
  return tags[nr]
}

function getGif (tag) {
  var deferred = Q.defer()
  tagUrl += tag + '?format=json'
  request({url: tagUrl, json: true}, function (err, response, body) {
    if (err) deferred.reject(new Error(err))
    if (response.statusCode === 200) {
      deferred.resolve(body.gifs[0].url)
    }
  })
  return deferred.promise
}

function renderGif (url) {
  var Page = React.createClass({
    displayName: 'Gif',
    reload: function() {
      window.location.reload();
    },
    render: function () {
      var style = {
        position: 'fixed',
        top: 0,
        left: 0,
        minWidth: '100%',
        minHeight: '100%',
        cursor: 'pointer'
      }
      return <img src={url} style={style} onClick={this.reload} />
    }
  })
  React.render(<Page/>, document.querySelector('#app'))
}

Q.fcall(getTagList)
.then(selectTag)
.then(getGif)
.then(renderGif)
.catch(function (err) {
  console.log(err)
})
.done()
