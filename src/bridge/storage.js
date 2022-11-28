import React, { Component } from 'react';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { DEFAULT_DB_USER, DEFAULT_DB_HOME } from '../config';

const storage = new Storage({
  size            : 1000,// maximum capacity, default 1000
  storageBackend  : AsyncStorage, // for web: window.localStorage
  defaultExpires  : 1000 * 3600 * 24, // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  enableCache     : true,
  sync            : {}
});

export const save = (params) => {
  return storage.save({
    key     : params.table,
    data    : params.data,
    expires : (params.expires) ? params.expires : null
  });
}

export const saveUseId = (params) => {
  return storage.save({
    key     : params.table,
    id      : params.id,
    data    : params.data,
    expires : (params.expires) ? params.expires : null
  });
}

export const getBy = (params) => {
  return storage.load({
    key   : params.table,
    id    : params.id
  }).then(ret => {
    return ret;
  }).catch(err => {
    switch (err.name) {
      case 'NotFoundError':
        // TODO;
        break;
      case 'ExpiredError':
        // TODO
        break;
    }
  });
}

export const get = (params) => {
  return storage.load({
    key               : params.table,
    autoSync          : true,
    syncInBackground  : true,
    syncParams        : {
      extraFetchOptions: {},
      someFlag: true
    }
  }).then(ret => {
    return ret;
  }).catch(err => {
    switch (err.name) {
      case 'NotFoundError':
        // TODO;
        break;
      case 'ExpiredError':
        // TODO
        break;
    }
  });
}

export const status_login = async (params) => {
  return storage.load({
    key               : DEFAULT_DB_USER,
    autoSync          : true,
    syncInBackground  : true,
    syncParams        : {
      extraFetchOptions: {},
      someFlag: true
    }
  }).then(ret => {
    return ret;
  }).catch(err => {
    // console.warn(err.message);
    switch (err.name) {
      case 'NotFoundError':
        // TODO;
        break;
      case 'ExpiredError':
        // TODO
        break;
    }
  });
}

export const logout = (params) => {
  return storage.remove({
    key : DEFAULT_DB_USER
  });
}

export const remove = (params) => {
  return storage.remove({
    key : params.table
  });
}

export const removeBy = (params) => {
  return storage.remove({
    key : params.table,
    id  : params.id
  });
}

export const getBatch = (params) => {
  return storage.getBatchData(params.table).then(results => {
  	return results;
  })
}

export const getBatchBy = (params) => {
  return storage.getBatchDataWithIds({
  	key  : params.table,
  	ids  : params.ids
  }).then(results => {
    return results;
  });
}
