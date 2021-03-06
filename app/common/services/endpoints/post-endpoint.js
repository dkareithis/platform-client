module.exports = [
    '$resource',
    '$rootScope',
    'Util',
    '_',
    '$http',
function (
    $resource,
    $rootScope,
    Util,
    _,
    $http
) {

    var PostEndpoint = $resource(Util.apiUrl('/posts/:id/:extra'), {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike',
            params: {
                order: 'desc',
                orderby: 'post_date'
            }
        },
        get: {
            method: 'GET',
            transformResponse: function (data /*, header*/) {
                data = angular.fromJson(data);
                // Ensure values is always an object
                if (_.isArray(data.values)) {
                    data.values = _.object(data.values);
                }
                if (!_.isArray(data.published_to)) {
                    data.published_to = [];
                }
                return data;
            }
        },
        update: {
            method: 'PUT'
        },
        options: {
            method: 'OPTIONS'
        },
        geojson: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/geojson'),
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike',
            cancellable: true
        },
        stats: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/stats'),
            isArray: false,
            paramSerializer: '$httpParamSerializerJQLike'
        },
        collections: {
            method: 'GET',
            url: Util.apiUrl('/posts/:id/collections'),
            isArray: true
        }
    });

    PostEndpoint.export = function (filters) {
        var config =  {
            params: filters,
            paramSerializer: '$httpParamSerializerJQLike'
        };

        return $http.get(Util.apiUrl('/posts/export'), config);
    };

    $rootScope.$on('event:authentication:logout:succeeded', function () {
        PostEndpoint.query();
    });

    return PostEndpoint;

}];
