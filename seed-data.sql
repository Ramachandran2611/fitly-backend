--
-- PostgreSQL database dump
--


-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (id, name, slug) VALUES (1, 'Creatine', 'creatine');
INSERT INTO public.categories (id, name, slug) VALUES (2, 'Whey Protein', 'whey-protein');
INSERT INTO public.categories (id, name, slug) VALUES (3, 'Pre-Workout', 'pre-workout');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products (id, name, brand, category_id, price, discount_price, stock_quantity, is_veg, rating_avg, review_count, description, image_url, created_at) VALUES (1, 'Micronized Creatine Monohydrate 250g', 'Wellcore', 1, 899.00, 699.00, 40, true, 4.8, 15314, 'Pure micronized creatine monohydrate for strength and recovery.', NULL, '2026-08-16 21:47:38.760972+05:30');
INSERT INTO public.products (id, name, brand, category_id, price, discount_price, stock_quantity, is_veg, rating_avg, review_count, description, image_url, created_at) VALUES (2, 'Creatine Monohydrate 100g', 'Osmo', 1, 499.00, NULL, 0, true, 4.5, 210, 'Unflavored creatine, easy to mix.', NULL, '2026-08-16 21:47:38.760972+05:30');
INSERT INTO public.products (id, name, brand, category_id, price, discount_price, stock_quantity, is_veg, rating_avg, review_count, description, image_url, created_at) VALUES (3, 'Whey Protein Concentrate 1kg Chocolate', 'Wellcore', 2, 2199.00, 1799.00, 25, false, 4.6, 3021, '24g protein per serving, rich chocolate flavor.', NULL, '2026-08-16 21:47:38.760972+05:30');
INSERT INTO public.products (id, name, brand, category_id, price, discount_price, stock_quantity, is_veg, rating_avg, review_count, description, image_url, created_at) VALUES (4, 'Whey Protein Isolate 2kg Vanilla', 'Osmo', 2, 4199.00, 3599.00, 12, false, 4.7, 1287, 'Low-carb isolate, fast absorbing.', NULL, '2026-08-16 21:47:38.760972+05:30');
INSERT INTO public.products (id, name, brand, category_id, price, discount_price, stock_quantity, is_veg, rating_avg, review_count, description, image_url, created_at) VALUES (5, 'Pre-Workout Blast 300g Watermelon', 'Wellcore', 3, 1599.00, 1299.00, 8, true, 4.4, 542, 'Caffeine + beta-alanine energy blend.', NULL, '2026-08-16 21:47:38.760972+05:30');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--


