
export const removeFalsies = obj =>  _.transform(obj, (o, v, k) => {
        if (v && typeof v === 'object') {
            o[k] = _.removeFalsies(v)
        } else if (v !== undefined) {
            o[k] = v
        }
    })

_.mixin({ 'removeFalsies': removeFalsies });
