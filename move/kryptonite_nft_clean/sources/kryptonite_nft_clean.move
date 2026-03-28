module kryptonite_nft_clean::kryptonite_nft_clean {
    use iota::display;
    use iota::object::{Self, UID};
    use iota::package;
    use iota::transfer;
    use iota::tx_context::{Self, TxContext, sender};
    use std::string::{String, utf8};
    use std::vector;

    /// One-time witness for claiming Publisher + setting Display.
    public struct KRYPTONITE_NFT_CLEAN has drop {}

    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
    }

    fun init(otw: KRYPTONITE_NFT_CLEAN, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"description"),
            utf8(b"image_url"),
            utf8(b"thumbnail_url"),
            utf8(b"project_url"),
            utf8(b"creator")
        ];

        let values = vector[
            utf8(b"{name}"),
            utf8(b"{description}"),
            utf8(b"{image_url}"),
            utf8(b"{image_url}"),
            utf8(b"https://kryptoniteminter.vercel.app"),
            utf8(b"KryptoniteAli")
        ];

        let publisher = package::claim(otw, ctx);
        let mut nft_display = display::new_with_fields<NFT>(&publisher, keys, values, ctx);
        display::update_version(&mut nft_display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(nft_display, sender(ctx));
    }

    public entry fun mint_to_sender(
        name: String,
        description: String,
        image_url: String,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            image_url,
        };

        transfer::public_transfer(nft, sender(ctx));
    }

    public fun name(nft: &NFT): &String {
        &nft.name
    }

    public fun description(nft: &NFT): &String {
        &nft.description
    }

    public fun image_url(nft: &NFT): &String {
        &nft.image_url
    }
}
