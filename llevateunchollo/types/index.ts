export interface Category {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number | null
  stock: number
  images: string[]
  category: Category
  categoryId: string
  active: boolean
  whatsappMsg?: string | null
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  name: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  status: string
  total: number
  stripeId?: string
  items: OrderItem[]
  createdAt: string
}
