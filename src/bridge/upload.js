import React, { Component } from 'react';
import { Alert } from 'react-native';
import { BASE_URL_UPLOAD, DEFAULT_REQUEST, DEFAULT_TIMEOUT, BASE_URL } from '../config';
import { get } from './storage';
import Toast from 'react-native-simple-toast';
import Mime from 'react-native-mime-types';
import t from '../lang';
/* error code
  301 : waktu habis
  302 : error koneksi client
  303 : masalah server | tidak spesifik
  304 : respon json tidak valid
  305 : status server error header : 500 / 404 / 403
*/

const upload = (params) => {
    const method      = (params.method) ? params.method : DEFAULT_REQUEST;

    const imageData = new FormData();
    Object.keys(params).map(function(item, index) {
      if (item !== 'image') {
        imageData.append(item, params[item]);
      }
    })
    if (!params.image.type || params.image.type == null) {
      let mime = Mime.lookup(params.image.path);
      params.image.type = mime;
    }
    imageData.append('files', {
        uri : params.image.uri,
        type: params.image.type,
        name: params.image.fileName
    });

    let didResponse = false;

    return _fetch(fetch_promise(), DEFAULT_TIMEOUT);

    async function _fetch(fetch_promise, timeout) {
      var abort_fn = null;
      var abort_promise = new Promise((resolve, reject) => {
          abort_fn = function() {
            if (!didResponse) {
              Toast.show(t('aError', {ercode : 'ERR_301'}),Toast.SHORT);
            }
            reject('abort promise');
          };
      });
      var abortable_promise = Promise.race([
          fetch_promise,
          abort_promise
      ]);
      setTimeout(function(){
          abort_fn();
      }, timeout);

      return abortable_promise;
  }

  async function fetch_promise() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL_UPLOAD, {
            method  : method,
            headers : {
              'Accept'        : 'application/json',
              'Content-Type'  : 'multipart/form-data'
            },
            body: imageData
        }).then(checkStatus).then((response) => {
            return response.json();
        }).then((jsonData) => {
            didResponse = true;
            resolve(jsonData);
        }).catch((err) => {
            reject(err);
            didResponse = true;
            let msg     = '000';
            if (err.message === 'Network request failed'){
              msg = t('aError', {ercode : 'ERR_302'});
            } else if (err === 'abort promise'){
              msg = t('aError', {ercode : 'ERR_303'});
            }else {
              msg = t('aError', {ercode : 'ERR_304'});
            }
        })
    })
  }

  async function checkStatus(res) {
    if (res.ok) { // res.status >= 200 && res.status < 300
      return res;
    } else {
      Toast.show(t('aError', {ercode : 'ERR_305'}),Toast.SHORT);
    }
  }

}

export default upload;
