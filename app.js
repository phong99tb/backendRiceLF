var express = require('express');
var app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hello World');
})

var server = app.listen(8000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Ung dung Node.js dang lang nghe tai dia chi: http://%s:%s", host, port)
})

mongoose.connect('mongodb+srv://phong99tb:8b8V6aJF65kbbIr0@cluster-mongo-test.yudxgg4.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
        console.log('Connected!')
        const UserSchema = new Schema({
            id: Schema.Types.ObjectId,
            name: String,
        });

        const User = mongoose.model('User', UserSchema);

        const DepositSchema = new Schema({
            id: Schema.Types.ObjectId,
            idUser: Schema.Types.ObjectId,
            money: Number,
            date: String
        });

        const Deposit = mongoose.model('Deposit', DepositSchema);

        app.get('/list', async (req, res) => {
            try {
                const users = await User.find({});
                res.json(users);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ MongoDB:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.post('/addUser', async (req, res) => {
            try {
                const { name } = req.body;

                // Kiểm tra nếu không có tên
                if (!name) {
                    return res.status(400).json({ error: 'Tên không được để trống.' });
                }

                // Tạo người dùng mới
                const newUser = new User({ name });
                console.log(newUser);

                // Lưu vào cơ sở dữ liệu
                await newUser.save();

                res.json({ message: 'Người dùng đã được thêm thành công.', user: newUser });
            } catch (error) {
                console.error('Lỗi khi thêm người dùng:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.delete('/deleteUser/:id', async (req, res) => {
            try {
                const userId = req.params.id;

                // Kiểm tra nếu userId không hợp lệ
                if (!mongoose.Types.ObjectId.isValid(userId)) {
                    return res.status(400).json({ error: 'ID không hợp lệ.' });
                }

                // Sử dụng phương thức deleteOne để xóa người dùng
                const result = await User.deleteOne({ _id: userId });

                // Kiểm tra nếu không có người dùng nào được xóa
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy người dùng với ID đã cho.' });
                }

                res.json({ message: 'Người dùng đã được xóa thành công.' });
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/listDeposit', async (req, res) => {
            try {
                const deposit = await Deposit.find({});
                res.json(deposit);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ MongoDB:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.post('/addDeposit', async (req, res) => {
            try {
                const { idUser, money, date } = req.body;

                // Kiểm tra nếu không có idUser hoặc money
                if (!idUser || !money) {
                    return res.status(400).json({ error: 'idUser và money không được để trống.' });
                }

                // Tạo giao dịch mới
                const newDeposit = new Deposit({ idUser, money, date });
                console.log(newDeposit);

                // Lưu vào cơ sở dữ liệu
                await newDeposit.save();

                res.json({ message: 'Giao dịch đã được thêm thành công.', deposit: newDeposit });
            } catch (error) {
                console.error('Lỗi khi thêm giao dịch:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        try {
            const users = await User.find({});
            console.log('Dữ liệu từ collection "users":', users);
        } catch (error) {
            console.error('Lỗi khi truy vấn dữ liệu:', error);
        }

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed due to app termination');
                process.exit(0);
            });
        });
    })
    .catch(error => {
        console.error('Lỗi kết nối đến MongoDB:', error);
    });


