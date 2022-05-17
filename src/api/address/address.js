import request from '@/utils/request'

export function getProvince(query) {
    return request({
        url: 'https://restapi.amap.com/v3/config/district?parameters',
        method: 'get',
        params: {
            key: "3a708a4ef5e3af28694b1c861985a5ce",
            keyWords: "中国",
            subdistrict: 3
        }
    })
}

export function create(data) {
    return request({
        url: '/address/create',
        method: 'POST',
        data: data
    })
}