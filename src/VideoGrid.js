import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import styles from "./VideoGrid.module.css";

const VideoGrid = ({ videos, handleVideoClick }) => {

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // Fetch Shopify product data
    useEffect(() => {
        const fetchShopifyData = async () => {
            const endpoint = "https://gristiptest.myshopify.com/api/2025-01/graphql.json"; 
            const accessToken = "7bcea6ccac70730be7c32d0dc91e5cd3"; 
            // api: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

            const query = `{
                products(first: 10) {
                    edges {
                        node {
                            id
                            title
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
            }`;

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Storefront-Access-Token": accessToken,
                    },
                    body: JSON.stringify({ query }),
                });

                const json = await response.json();
                const products = json.data.products.edges.map(({ node }) => ({
                    id: node.id,
                    name: node.title,
                    price: `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`,
                }));

                setProducts(products);
            } catch (error) {
                console.error("Error fetching Shopify data:", error);
            }
        };

        fetchShopifyData();
    }, []);


    if (!videos.length || !products.length) {
        return <p>Loading videos and products...</p>;
    }


  const handleConnectClick = () => {
    navigate('/connect'); // Navigate to the Connect page
  };

    return (
        <>
            <div className={styles.header}>
                <h1>Instagram Videos</h1>
            </div>
            <div className={styles["video-carousel-container"]}>
                <button className={`${styles["swiper-button-prev"]} swiper-button-prev styled-button`}>
                    &#10094;
                </button>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    breakpoints={{
                        100: { slidesPerView: 2 },
                        425: { slidesPerView: 5 },
                        1000: { slidesPerView: 6 },
                    }}
                >
                    {videos.map((video, index) => {
                        const product = products[index % products.length]; // Match videos with products in a loop
                        return (
                            <SwiperSlide key={video.id}>
                                <div className={styles["video-slide-container"]}>
                                    <video
                                        src={video.media_url}
                                        autoPlay
                                        loop
                                        muted
                                        className={styles["video-rectangle"]}
                                        onClick={() => handleVideoClick(video)}
                                    />
                                    <div className={styles["video-info"]}
                                        onClick={() => handleVideoClick(video)}>
                                        <span className={styles["product-name"]}>{product.name}</span>
                                        <span className={styles["product-price"]}>{product.price}</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <button className={`${styles["swiper-button-next"]} swiper-button-next styled-button`}>
                    &#10095;
                </button>
            </div>
        </>
    );
};

export default VideoGrid;