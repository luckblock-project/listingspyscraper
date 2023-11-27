const EventEmitter = require('events');
const fetch = require('node-fetch');

const eventEmitter = new EventEmitter();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const last1000 = [];

(async () => {

    const ts = Math.floor(Date.now() / 1000);

    const res = await fetch("https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev", {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/json",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        },
        "referrer": "https://listingspy.net/",
        "body": "{\"operationName\":\"GetNewPairs\",\"variables\":{\"limit\":200,\"skip\":0,\"start\":"+ts+"},\"query\":\"query GetNewPairs($limit: Int!, $skip: Int!, $start: Int!) {\\n  pairs(\\n    first: $limit\\n    skip: $skip\\n    orderBy: createdAtTimestamp\\n    orderDirection: desc\\n    where: {createdAtTimestamp_lt: $start}\\n  ) {\\n    token0 {\\n      name\\n      symbol\\n      id\\n      totalSupply\\n      totalLiquidity\\n      tradeVolume\\n      tradeVolumeUSD\\n      derivedETH\\n      untrackedVolumeUSD\\n      txCount\\n      __typename\\n    }\\n    token1 {\\n      name\\n      symbol\\n      id\\n      totalSupply\\n      totalLiquidity\\n      tradeVolume\\n      tradeVolumeUSD\\n      derivedETH\\n      untrackedVolumeUSD\\n      txCount\\n      __typename\\n    }\\n    createdAtTimestamp\\n    reserveETH\\n    reserveUSD\\n    volumeUSD\\n    id\\n    __typename\\n  }\\n  bundles(where: {id: \\\"1\\\"}) {\\n    ethPrice\\n    __typename\\n  }\\n}\"}",
        "method": "POST",
        "mode": "cors"
    });

    const json = await res.json();

    const pairs = json.data.pairs;

    for (const pair of pairs) {
        if (last1000.includes(pair.id)) continue;
        last1000.push(pair.id);
        eventEmitter.emit('newPair', pair);
    }

    await sleep(20_000);

})();
