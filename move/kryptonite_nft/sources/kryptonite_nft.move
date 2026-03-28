module kryptonite_nft::kryptonite_nft {
    use iota::object;
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};
    use std::string;

    public struct NFT has key, store {
        id: object::UID,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

    public entry fun mint_to_sender(
        name: string::String,
        description: string::String,
        image_url: string::String,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            image_url,
        };

        transfer::transfer(nft, tx_context::sender(ctx));
    }
}
