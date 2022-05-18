import request from '@/utils/request'

export function create(data) {
    return request({
        url: '/driver/create',
        method: 'POST',
        data: data
    })
}

export function pageByCondition(data) {
    return request({
        url: '/driver/pageByCondition',
        method: 'POST',
        data: data
    })
}

export function updateById(data) {
    return request({
        url: '/driver/updateById',
        method: 'POST',
        data: data
    })
}

export function deleteById(data) {
    return request({
        url: '/driver/deleteById',
        method: 'DELETE',
        params: {id: data}
    })
}
