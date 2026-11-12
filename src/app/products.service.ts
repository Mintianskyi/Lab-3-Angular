import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface Product {
  id?: number;
  title: string;
  price: number;
  category: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products';
  
  localProducts = signal<Product[]>([]);

  constructor(private http: HttpClient) {}

  private translateProduct(p: Product): Product {
    const uaData: { [key: number]: { title: string; category: string; description: string } } = {
      1: {
        title: "Рюкзак Fjallraven - Foldsack No. 1",
        category: "чоловічий одяг",
        description: "Ідеальний рюкзак для щоденного використання та прогулянок на природі. Має відділення для ноутбука до 15 дюймів."
      },
      2: {
        title: "Чоловіча повсякденна футболка Slim Fit",
        category: "чоловічий одяг",
        description: "Приталений стиль, м'яка та дихаюча тканина для максимального комфорту протягом усього дня."
      },
      3: {
        title: "Чоловіча бавовняна куртка",
        category: "чоловічий одяг",
        description: "Чудова верхня куртка для весни, осені та прохолодних днів. Підходить для роботи та активного відпочинку."
      },
      4: {
        title: "Чоловічі повсякденні штани Slim Fit",
        category: "чоловічий одяг",
        description: "Зручні повсякденні штани стильного крою з високоякісних матеріалів."
      },
      5: {
        title: "Жіночий золотий браслет Naga",
        category: "ювелірні вироби",
        description: "Натхненний міфічним водяним драконом, що захищає перлину океану."
      },
      6: {
        title: "Золотий кулон Petite Micropave",
        category: "ювелірні вироби",
        description: "Витончена золота прикраса для святкового та повсякденного образу."
      },
      7: {
        title: "Каблучка з білого золота Princess",
        category: "ювелірні вироби",
        description: "Класична каблучка з огранюванням, чудовий подарунок для близької людини."
      },
      8: {
        title: "Сережки з рожевого золота",
        category: "ювелірні вироби",
        description: "Сережки-тунелі з нержавіючої сталі з якісним покриттям."
      },
      9: {
        title: "Зовнішній жорсткий диск WD 2TB",
        category: "електроніка",
        description: "Швидка передача даних, висока надійність та додатковий простір для ваших файлів."
      },
      10: {
        title: "Внутрішній SSD накопичувач SanDisk 1TB",
        category: "електроніка",
        description: "Миттєве завантаження операційної системи, програм та ігор завдяки технології SATA III."
      },
      11: {
        title: "SSD накопичувач Silicon Power 256GB",
        category: "електроніка",
        description: "Підвищена продуктивність та швидка обробка даних для вашого комп'ютера."
      },
      12: {
        title: "Ігровий зовнішній жорсткий диск WD 4TB",
        category: "електроніка",
        description: "Створено спеціально для геймерів: величезний простір для зберігання ігор."
      },
      13: {
        title: "Монітор Acer 21.5\" Full HD IPS",
        category: "електроніка",
        description: "Широкоформатний тонкий дисплей з яскравими кольорами та підтримкою захисту очей."
      },
      14: {
        title: "Вигнутий ігровий монітор Samsung 49\"",
        category: "електроніка",
        description: "Надширокий ігровий екран з високою частотою оновлення для максимального занурення."
      },
      15: {
        title: "Жіноча зимова куртка 3-в-1",
        category: "жіночий одяг",
        description: "Теплий та практичний верхній одяг для холодів і негоди."
      },
      16: {
        title: "Жіноча шкіряна куртка-косуха",
        category: "жіночий одяг",
        description: "Стильний класичний дизайн із якісного еко-матеріалу."
      },
      17: {
        title: "Жіноча вітрозахисна куртка",
        category: "жіночий одяг",
        description: "Легкий та зручний плащ з капюшоном для прогулянок у дощову погоду."
      },
      18: {
        title: "Жіноча блуза з коротким рукавом",
        category: "жіночий одяг",
        description: "М'яка і приємна до тіла тканина на кожен день."
      },
      19: {
        title: "Жіноча спортивна футболка Opna",
        category: "жіночий одяг",
        description: "Дихаюча спортивна тканина, створена спеціально для активних тренувань."
      },
      20: {
        title: "Жіноча бавовняна футболка",
        category: "жіночий одяг",
        description: "Повсякденна бавовняна футболка вільного крою."
      }
    };

    if (p.id && uaData[p.id]) {
      return {
        ...p,
        title: uaData[p.id].title,
        category: uaData[p.id].category,
        description: uaData[p.id].description
      };
    }

    return p;
  }

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.map(p => this.translateProduct(p)))
    );
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.translateProduct(p))
    );
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => {
        const newProduct = { ...product, id: Date.now() };
        this.localProducts.update(list => [newProduct, ...list]);
      })
    );
  }
}