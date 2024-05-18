import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import DescriptionBox from "../DescriptionBox/DescriptionBox";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./SingleProduct.css";
import { MarketContext } from "../../Context/MarketContext";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(null);
  const { addToCart, cart } = useContext(MarketContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
      } catch (error) {
        console.error("Ürün detayları çekerken hata oluştu:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
      setError(null);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      setError(null);
    }
  };

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item._id === product._id);
    const totalQuantity = existingProduct
      ? existingProduct.quantity + quantity
      : quantity;

    if (totalQuantity > product.stock) {
      setError(
        `Stok ve sepete göre siz sadece ${
          product.stock - (existingProduct ? existingProduct.quantity : 0)
        } kadar ekleyebilirsiniz.`
      );
    } else {
      addToCart(product, quantity);
      navigate("/cart");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="single-product">
        <div className="single-product-left">
          <div className="single-product-image">
            <img
              className="single-product-main-image"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
        </div>
        <div className="single-product-right">
          <h1>{product.name}</h1>
          <div className="single-product-prices">
            <div className="single-product-price-old">{product.oldPrice}₺</div>
            <div className="single-product-price-new">
              {product.currentPrice}₺
            </div>
          </div>
          <div className="single-product-stock">Stok: {product.stock}</div>
          <div className="single-product-description">
            {product.description}
          </div>
          <div className="add-to-cart-counter">
            <FontAwesomeIcon
              icon={faMinus}
              className="cart-adjust-quantity add-to-cart-minus"
              onClick={decrementQuantity}
            ></FontAwesomeIcon>
            <p className="add-to-cart-quantity">{quantity}</p>
            <FontAwesomeIcon
              icon={faPlus}
              className="cart-adjust-quantity add-to-cart-plus"
              onClick={incrementQuantity}
            ></FontAwesomeIcon>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="add-to-cart" onClick={handleAddToCart}>
            Sepete Ekle
          </button>
        </div>
      </div>
      <DescriptionBox />
      <RelatedProducts />
    </>
  );
};

export default SingleProduct;
