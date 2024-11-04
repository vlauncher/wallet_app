import app from "./app";
import { createUsersTable } from "./models/users.models"
import { WalletModel } from "./models/wallet.models"

const port = process.env.PORT;

(async () => {
    await WalletModel.createWalletTable();
    await createUsersTable();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();
