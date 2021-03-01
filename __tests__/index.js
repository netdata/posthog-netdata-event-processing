const {
    createEvent,
    createIdentify,
    createPageview,
    createCache,
    getMeta,
    resetMeta,
    clone,
} = require('posthog-plugins/test/utils.js')
const { setupPlugin, processEvent } = require('../index')

beforeEach(() => {
    resetMeta({
        config: {
            bar: 'siin ei ole kala',
        },
    })
})

test('setupPlugin', async () => {
    expect(getMeta().config.bar).toEqual('siin ei ole kala')

    await setupPlugin(getMeta())

    expect(getMeta().global.setupDone).toEqual(true)
})

test('processEvent adds properties', async () => {
    // create a random event
    const event0 = createEvent({ event: 'booking completed', properties: { amount: '20', currency: 'USD' } })

    // must clone the event since `processEvent` will mutate it otherwise
    const event1 = await processEvent(clone(event0), getMeta())
    expect(event1).toEqual({
        ...event0,
        properties: {
            ...event0.properties,
            bar: 'siin ei ole kala',
            hello: 'world',
            lib_number: 6,
            $counter: 0,
        },
    })

    const event2 = await processEvent(clone(event0), getMeta())
    expect(event2).toEqual({
        ...event1,
        properties: {
            ...event1.properties,
            $counter: 1,
        },
    })

    const event3 = await processEvent(clone(event0), getMeta())
    expect(event3).toEqual({
        ...event2,
        properties: {
            ...event2.properties,
            $counter: 2,
        },
    })
})

test('processEvent does not crash with identify', async () => {
    // create a random event
    const event0 = createIdentify()

    // must clone the event since `processEvent` will mutate it otherwise
    const event1 = await processEvent(clone(event0), getMeta())
    expect(event1).toEqual(event0)
})
