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
            moneyUser: Number
        });
        const User = mongoose.model('User', UserSchema);

        const DepositSchema = new Schema({
            id: Schema.Types.ObjectId,
            idUser: Schema.Types.ObjectId,
            moneyDeposit: Number,
            date: String,
            note: String
        });
        const Deposit = mongoose.model('Deposit', DepositSchema);

        const SpendSchema = new Schema({
            id: Schema.Types.ObjectId,
            idUser: Schema.Types.ObjectId,
            moneySpend: Number,
            date: String,
            note: String
        });
        const Spend = mongoose.model('Spend', SpendSchema);

        app.get('/listUser', async (req, res) => {
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
                const { name, moneyUser } = req.body;

                // Kiểm tra nếu không có tên
                if (!name) {
                    return res.status(400).json({ error: 'Tên không được để trống.' });
                }

                // Tạo người dùng mới
                const newUser = new User({ name, moneyUser });
                console.log(newUser);

                // Lưu vào cơ sở dữ liệu
                await newUser.save();

                res.json({ message: 'Người dùng đã được thêm thành công.', user: newUser });
            } catch (error) {
                console.error('Lỗi khi thêm người dùng:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.put('/updateUser/:id', async (req, res) => {
            try {
                const userId = req.params.id;

                // Kiểm tra nếu userId không hợp lệ
                if (!mongoose.Types.ObjectId.isValid(userId)) {
                    return res.status(400).json({ error: 'ID không hợp lệ.' });
                }

                const { name } = req.body;
                console.log(req);

                // Kiểm tra nếu newName không được cung cấp
                if (!name) {
                    return res.status(400).json({ error: 'Tên mới không được để trống.' });
                }

                // Sử dụng phương thức updateOne để sửa đổi người dùng
                const result = await User.updateOne({ _id: userId }, { $set: { name: name } });

                // Kiểm tra nếu không có người dùng nào được sửa đổi
                if (result.nModified === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy người dùng với ID đã cho.' });
                }

                res.json({ message: 'Người dùng đã được sửa đổi thành công.' });
            } catch (error) {
                console.error('Lỗi khi sửa đổi người dùng:', error);
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
                const { idUser, moneyDeposit, date, note } = req.body;
                if (!idUser || !moneyDeposit) {
                    return res.status(400).json({ error: 'idUser và money không được để trống.' });
                }
                const newDeposit = new Deposit({ idUser, moneyDeposit, date, note });
                await newDeposit.save();
                res.json({ message: 'Giao dịch đã được thêm thành công.', deposit: newDeposit });
            } catch (error) {
                console.error('Lỗi khi thêm giao dịch:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.delete('/deleteDeposit/:id', async (req, res) => {
            try {
                const depositId = req.params.id;

                // Kiểm tra nếu depositId không hợp lệ
                if (!mongoose.Types.ObjectId.isValid(depositId)) {
                    return res.status(400).json({ error: 'ID không hợp lệ.' });
                }

                // Sử dụng phương thức deleteOne để xóa giao dịch
                const result = await Deposit.deleteOne({ _id: depositId });

                // Kiểm tra nếu không có giao dịch nào được xóa
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy giao dịch với ID đã cho.' });
                }

                res.json({ message: 'Giao dịch đã được xóa thành công.' });
            } catch (error) {
                console.error('Lỗi khi xóa giao dịch:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.put('/updateDeposit/:id', async (req, res) => {
            try {
                const depositId = req.params.id;
                if (!mongoose.Types.ObjectId.isValid(depositId)) {
                    return res.status(400).json({ error: 'ID không hợp lệ.' });
                }
                const { moneyDeposit, date, note } = req.body;
                if (!moneyDeposit) {
                    return res.status(400).json({ error: 'Số tiền mới không được để trống.' });
                }
                const result = await Deposit.updateOne({ _id: depositId }, { $set: { moneyDeposit: moneyDeposit, date: date, note: note } });
                if (result.nModified === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy giao dịch với ID đã cho.' });
                }

                res.json({ message: 'Giao dịch đã được sửa đổi thành công.' });
            } catch (error) {
                console.error('Lỗi khi sửa đổi giao dịch:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get('/listSpend', async (req, res) => {
            try {
                const spend = await Spend.find({});
                res.json(spend);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ MongoDB:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.post('/addSpend', async (req, res) => {
            try {
                const { idUser, moneySpend, date, note } = req.body;
                if (!idUser || !moneySpend) {
                    return res.status(400).json({ error: 'idUser và money không được để trống.' });
                }
                const newSpend = new Spend({ idUser, moneySpend, date, note });
                await newSpend.save();
                res.json({ message: 'Giao dịch đã được thêm thành công.', spend: newSpend });
            } catch (error) {
                console.error('Lỗi khi thêm giao dịch:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.delete('/deleteSpend/:id', async (req, res) => {
            try {
                const spendId = req.params.id;

                // Kiểm tra nếu spendId không hợp lệ
                if (!mongoose.Types.ObjectId.isValid(spendId)) {
                    return res.status(400).json({ error: 'ID không hợp lệ.' });
                }

                // Sử dụng phương thức deleteOne để xóa giao dịch
                const result = await Spend.deleteOne({ _id: spendId });

                // Kiểm tra nếu không có giao dịch nào được xóa
                if (result.deletedCount === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy giao dịch với ID đã cho.' });
                }

                res.json({ message: 'Giao dịch đã được xóa thành công.' });
            } catch (error) {
                console.error('Lỗi khi xóa giao dịch:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.put('/updateSpend/:id', async (req, res) => {
            try {
                const spendId = req.params.id;
                if (!mongoose.Types.ObjectId.isValid(spendId)) {
                    return res.status(400).json({ error: 'ID không hợp lệ.' });
                }
                const { moneySpend, date, note } = req.body;
                if (!moneySpend) {
                    return res.status(400).json({ error: 'Số tiền mới không được để trống.' });
                }
                const result = await Spend.updateOne({ _id: spendId }, { $set: { moneySpend: moneySpend, date: date, note: note } });
                if (result.nModified === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy giao dịch với ID đã cho.' });
                }

                res.json({ message: 'Giao dịch đã được sửa đổi thành công.' });
            } catch (error) {
                console.error('Lỗi khi sửa đổi giao dịch:', error);
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


