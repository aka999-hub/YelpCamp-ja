// YelpCamp-ja/seeds/index.js

// process.env.NODE_ENV：node.jsの環境変数
if (process.env.NODE_ENV !== 'production') {    // production：本番用
    // node.js が開発用で起動している場合は、dotenvの設定を使用する
    require('dotenv').config();
}

const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')


// MongoDB接続
const dbUrl = process.env.DB_URL || 'mongodb://db:27017/yelp-camp'; // プロパティのDB設定、無い場合は 'mongodb://db:27017/yelp-camp', 
console.log(`process.env.DB_URL=${process.env.DB_URL}`);
mongoose.connect(dbUrl, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log('MongoDBコネクションOK!!!')
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー!!!')
        console.log(err)
    })

// タイトル作成用
const sample = array => array[Math.floor(Math.random() * array.length)]

// DBのデータ削除（初期処理でデータ削除）
const seedDB = async () => {
    // 全データ削除
    await Campground.deleteMany({})

    // // テスト用にデータ登録
    // const c = new Campground({ title: 'オートキャンプ' })
    // await c.save()

    for (let i = 0; i < 50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length)
        const randomPlaceIndex = Math.floor(Math.random() * places.length)
        const randomDescriptorsIndex = Math.floor(Math.random() * descriptors.length)

        const price = Math.floor(Math.random() * 2000) + 1000   // 1000~3000円
        const camp = new Campground({
            author: '68d1dea27752bb2495f06306',
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
            description: '木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。',
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomCityIndex].longitude,
                    cities[randomCityIndex].latitude
                ]
            },
            price,   // 省略表記
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dwwqzevrb/image/upload/v1754776624/YelpCamp/qiehjhssde94z72h7wiu.jpg',
                    filename: 'YelpCamp/qiehjhssde94z72h7wiu'
                },
                {
                    url: 'https://res.cloudinary.com/dwwqzevrb/image/upload/v1754776626/YelpCamp/klmucnjsqu1xanamzbq9.jpg',
                    filename: 'YelpCamp/klmucnjsqu1xanamzbq9'
                },
                {
                    url: 'https://res.cloudinary.com/dwwqzevrb/image/upload/v1754776627/YelpCamp/y1r79q7eljttlloc8gbz.jpg',
                    filename: 'YelpCamp/y1r79q7eljttlloc8gbz'
                }
            ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})