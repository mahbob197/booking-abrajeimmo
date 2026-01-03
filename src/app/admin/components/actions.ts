'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Actions pour les produits
export async function activateProduct(formData: FormData) {
  const id = Number(formData.get('id'));
  const active = formData.get('active') === 'true';

  await prisma.product.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin');
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get('id'));

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin');
}

// Actions pour les utilisateurs
export async function activateUser(formData: FormData) {
  const id = Number(formData.get('id'));
  const active = formData.get('active') === 'true';

  await prisma.user.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin');
}

// Actions pour les réservations
export async function updateReservationStatus(formData: FormData) {
  const id = Number(formData.get('id'));
  const status = formData.get('status') as string;

  await prisma.reservation.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin');
}

export async function deleteReservation(formData: FormData) {
  const id = Number(formData.get('id'));

  await prisma.reservation.delete({
    where: { id },
  });

  revalidatePath('/admin');
}
